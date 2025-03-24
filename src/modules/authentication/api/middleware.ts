import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken, verifyRefreshToken } from '@/shared/utils/jwt'
import { db } from '@/server/db'
import { sessions, users } from '@/server/db/schemas'
import { eq } from 'drizzle-orm'

/**
 * This middleware prevents authenticated users from accessing login/register pages
 */
export async function preventAuthenticatedAccess(request: NextRequest): Promise<NextResponse | undefined> {
	// Check if the route is login or register
	const url = request.nextUrl.pathname
	if (!['/login', '/register', '/auth/login', '/auth/register'].includes(url)) {
		return undefined // Not a protected route, continue
	}

	try {
		// Check for access token
		const accessToken = request.cookies.get('access_token')?.value
		if (!accessToken) {
			return undefined // No token, allow access to login/register
		}

		try {
			// Verify access token
			const payload = await verifyAccessToken(accessToken)

			// User is authenticated, redirect to dashboard or home
			return NextResponse.redirect(new URL('/dashboard', request.url))
		} catch (error) {
			// Access token is invalid or expired, try to refresh
			const refreshToken = request.cookies.get('refresh_token')?.value

			if (!refreshToken) {
				return undefined // No valid refresh token, allow access to login/register
			}

			try {
				// Verify refresh token
				const payload = await verifyRefreshToken(refreshToken)

				// Check if token exists in database
				const session = await db.query.sessions.findFirst({
					where: eq(sessions.refreshToken, refreshToken),
				})

				if (!session) {
					return undefined // Invalid session, allow access to login/register
				}

				// User has valid session, redirect to dashboard or home
				return NextResponse.redirect(new URL('/dashboard', request.url))
			} catch (error) {
				return undefined // Invalid refresh token, allow access to login/register
			}
		}
	} catch (error) {
		return undefined // Error occurred, allow access to login/register
	}
}

/**
 * Higher-order function to protect API routes with authentication
 * @param request The Next.js request object
 * @returns The response from the handler or an unauthorized response
 */
export async function withAuth(request: NextRequest) {
	const token = request.cookies.get('accessToken')?.value

	if (!token) {
		return new Response(JSON.stringify({ message: 'No token provided' }), {
			status: 401,
		})
	}

	try {
		await verifyAccessToken(token)
		return null
	} catch {
		return new Response(JSON.stringify({ message: 'Invalid token' }), {
			status: 401,
		})
	}
}

/**
 * Middleware to protect admin routes
 */
export async function requireAdminRole(request: NextRequest) {
	const token = request.cookies.get('accessToken')?.value

	if (!token) {
		return new Response(JSON.stringify({ message: 'No token provided' }), {
			status: 401,
		})
	}

	try {
		const payload = await verifyAccessToken(token)
		if (payload.role !== 'admin') {
			return new Response(JSON.stringify({ message: 'Unauthorized' }), {
				status: 403,
			})
		}
		return null
	} catch {
		return new Response(JSON.stringify({ message: 'Invalid token' }), {
			status: 401,
		})
	}
}

export async function withRefreshToken(request: NextRequest) {
	const token = request.cookies.get('refreshToken')?.value

	if (!token) {
		return new Response(JSON.stringify({ message: 'No refresh token provided' }), {
			status: 401,
		})
	}

	try {
		await verifyRefreshToken(token)
		return null
	} catch {
		return new Response(JSON.stringify({ message: 'Invalid refresh token' }), {
			status: 401,
		})
	}
}
