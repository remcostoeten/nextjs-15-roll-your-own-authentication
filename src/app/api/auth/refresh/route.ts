import { NextRequest, NextResponse } from 'next/server'
import { refreshToken } from '@/modules/authentication/api/mutations/refresh-token'
import { env } from 'env'

export async function POST(request: NextRequest) {
	try {
		// Get the refresh token from cookies
		const token = request.cookies.get('refresh_token')?.value

		if (!token) {
			// Clear cookies since we have no refresh token
			const response = NextResponse.json(
				{ error: 'Refresh token is required' },
				{ status: 400 }
			)

			response.cookies.delete('access_token')
			response.cookies.delete('refresh_token')

			return response
		}

		// Get request info (optional)
		const userAgent = request.headers.get('user-agent') || undefined
		const ipAddress =
			request.headers.get('x-forwarded-for') ||
			request.headers.get('x-real-ip') ||
			undefined

		// Call the refresh function
		const result = await refreshToken(token, { userAgent, ipAddress })

		// Check if there's a callbackUrl for redirecting after refresh
		const callbackUrl = request.nextUrl.searchParams.get('callbackUrl')

		// Create a response - either JSON or redirect
		const response = callbackUrl
			? NextResponse.redirect(
					new URL(decodeURI(callbackUrl), request.url)
				)
			: NextResponse.json(result, { status: 200 })

		// Set new cookies
		response.cookies.set({
			name: 'access_token',
			value: result.tokens.accessToken,
			httpOnly: true,
			secure: env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 15 * 60, // 15 minutes
			path: '/',
		})

		response.cookies.set({
			name: 'refresh_token',
			value: result.tokens.refreshToken,
			httpOnly: true,
			secure: env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60, // 7 days
			path: '/',
		})

		return response
	} catch (error) {
		console.error('Token refresh error:', error)

		// Determine redirect URL based on callbackUrl or default to login
		const callbackUrl = request.nextUrl.searchParams.get('callbackUrl')
		const response = callbackUrl
			? NextResponse.redirect(new URL('/login', request.url))
			: NextResponse.json(
					{
						error:
							error instanceof Error
								? error.message
								: 'An error occurred during token refresh',
					},
					{ status: 401 }
				)

		// Clear the cookies if the refresh fails
		response.cookies.delete('access_token')
		response.cookies.delete('refresh_token')

		// Add callbackUrl to redirect if available
		if (
			callbackUrl &&
			response instanceof NextResponse &&
			response.headers.get('Location')
		) {
			const redirectUrl = new URL(response.headers.get('Location') || '')
			redirectUrl.searchParams.set('callbackUrl', callbackUrl)
			return NextResponse.redirect(redirectUrl)
		}

		return response
	}
}

// Add a GET handler for handling direct navigation to refresh endpoint
export async function GET(request: NextRequest) {
	// For GET requests, we assume it's a direct navigation from middleware
	// and we need to handle the refresh and redirect
	return POST(request)
}
