'use server'

import type { OAuthProvider, OAuthResponse } from './types'

export async function oauthLogin(
	provider: OAuthProvider
): Promise<OAuthResponse> {
	try {
		const redirectUrl = `/api/auth/${provider}`
		return { success: true, redirectUrl }
	} catch (error) {
		console.error(`${provider} login error:`, error)
		return { success: false, error: `Failed to initiate ${provider} login` }
	}
}
