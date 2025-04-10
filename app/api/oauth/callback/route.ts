import { type NextRequest, NextResponse } from 'next/server'
import { oauthService } from '@/modules/authentication/utilities/oauth/oauth-service'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams
		const code = searchParams.get('code')
		const state = searchParams.get('state')
		const provider = searchParams.get('provider') || 'github' // Default to github if not provided
		const error = searchParams.get('error')

		// Check for errors
		if (error) {
			return NextResponse.redirect(
				new URL(`/login?error=${error}`, request.url)
			)
		}

		// Validate parameters
		if (!code || !state) {
			return NextResponse.redirect(
				new URL('/login?error=invalid_request', request.url)
			)
		}

		// Handle the callback
		const { token, isNewUser } = await oauthService.handleCallback(
			provider,
			code,
			state
		)

		// Set the token cookie
		const cookieStore = await cookies()
		cookieStore.set('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7, // 7 days
			path: '/',
		})

		// Redirect to the appropriate page
		if (isNewUser) {
			return NextResponse.redirect(
				new URL('/dashboard/user/profile?welcome=true', request.url)
			)
		} else {
			return NextResponse.redirect(new URL('/dashboard', request.url))
		}
	} catch (error) {
		console.error('OAuth callback error:', error)
		return NextResponse.redirect(
			new URL('/login?error=oauth_error', request.url)
		)
	}
}
