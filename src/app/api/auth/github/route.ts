import { NextResponse } from 'next/server'

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function GET() {
	if (!GITHUB_CLIENT_ID) {
		return NextResponse.redirect(
			new URL('/login?error=OAuth configuration error', APP_URL)
		)
	}

	// State parameter to prevent CSRF attacks
	const state = Math.random().toString(36).substring(7)

	const params = new URLSearchParams({
		client_id: GITHUB_CLIENT_ID,
		redirect_uri: `${APP_URL}/api/auth/callback/github`,
		scope: 'read:user user:email',
		state,
		allow_signup: 'true'
	})

	// Create response with GitHub OAuth URL
	const response = NextResponse.redirect(
		`https://github.com/login/oauth/authorize?${params.toString()}`
	)

	// Set state cookie with proper configuration
	response.cookies.set('github_oauth_state', state, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		path: '/',
		maxAge: 60 * 5 // 5 minutes
	})

	return response
}
