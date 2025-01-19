import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { generateOAuthState } from '@/server/mutations/auth/oauth/state'
import {
	OAUTH_ENDPOINTS,
	OAUTH_SCOPES,
	OAUTH_COOKIE_NAMES
} from '@/server/mutations/auth/oauth/constants'

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function GET() {
	if (!GITHUB_CLIENT_ID) {
		console.error('Missing GitHub client ID')
		return NextResponse.redirect(
			new URL('/login?error=OAuth configuration error', APP_URL)
		)
	}

	// Generate state parameter to prevent CSRF attacks
	const state = await generateOAuthState()

	const params = new URLSearchParams({
		client_id: GITHUB_CLIENT_ID,
		redirect_uri: `${APP_URL}/api/auth/callback/github`,
		scope: OAUTH_SCOPES.GITHUB.join(' '),
		state,
		allow_signup: 'true'
	})

	// Create response with GitHub OAuth URL
	const response = NextResponse.redirect(
		`${OAUTH_ENDPOINTS.GITHUB.AUTH}?${params.toString()}`
	)

	// Set state cookie with proper configuration
	cookies().set(OAUTH_COOKIE_NAMES.GITHUB, state, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		path: '/',
		maxAge: 60 * 5 // 5 minutes
	})

	return response
}
