'use server'

import { cookies } from 'next/headers'
import { OAUTH_STATE_COOKIE_NAME } from './constants'

export function generateOAuthState() {
	return Math.random().toString(36).substring(7)
}

export async function setOAuthState(state: string) {
	;(await cookies()).set(OAUTH_STATE_COOKIE_NAME, state, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 60 * 5 // 5 minutes
	})
}

export async function getOAuthState() {
	return (await cookies()).get(OAUTH_STATE_COOKIE_NAME)?.value
}

export async function clearOAuthState() {
	;(await cookies()).delete(OAUTH_STATE_COOKIE_NAME)
}
