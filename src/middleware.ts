// middleware.ts
import { jwtVerify } from 'jose' // Using jose instead of jsonwebtoken for Edge compatibility
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Define protected routes that require authentication
const protectedRoutes = ['/dashboard', '/profile', '/settings']
const authRoutes = ['/login', '/signup']

export async function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname
	const token = request.cookies.get('session')?.value

	// Helper function to verify JWT token
	const verifyToken = async (token: string) => {
		try {
			const secret = new TextEncoder().encode(
				process.env.JWT_SECRET || 'secret'
			)
			const { payload } = await jwtVerify(token, secret)
			return payload
		} catch {
			return null
		}
	}

	try {
		// Handle protected routes
		if (protectedRoutes.some((route) => pathname.startsWith(route))) {
			if (!token) {
				// No token, redirect to /sign-in
				const url = new URL('/sign-in', request.url)
				url.searchParams.set('from', pathname)
				return NextResponse.redirect(url)
			}

			const payload = await verifyToken(token)
			if (!payload) {
				// Invalid token, clear it and redirect to /sign-in
				const response = NextResponse.redirect(
					new URL('/sign-in', request.url)
				)
				response.cookies.delete('session')
				return response
			}

			// Valid token, allow access
			return NextResponse.next()
		}

		// Handle auth routes (/sign-in/sign-up)
		if (authRoutes.some((route) => pathname.startsWith(route))) {
			if (token) {
				const payload = await verifyToken(token)
				if (payload) {
					// Valid token, redirect to dashboard
					return NextResponse.redirect(
						new URL('/dashboard', request.url)
					)
				}
				// Invalid token, clear it
				const response = NextResponse.next()
				response.cookies.delete('session')
				return response
			}
		}

		// Allow public routes
		return NextResponse.next()
	} catch (error) {
		console.error('Middleware error:', error)
		// On error, clear session and redirect to login for protected routes
		if (protectedRoutes.some((route) => pathname.startsWith(route))) {
			const response = NextResponse.redirect(
				new URL('/sign-in', request.url)
			)
			response.cookies.delete('session')
			return response
		}
		return NextResponse.next()
	}
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 */
		'/((?!api|_next/static|_next/image|favicon.ico|public).*)'
	]
}
