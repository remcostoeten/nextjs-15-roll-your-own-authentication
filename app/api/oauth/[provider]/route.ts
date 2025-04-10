import { type NextRequest, NextResponse } from 'next/server'
import { oauthService } from '@/modules/authentication/utilities/oauth/oauth-service'

export async function GET(
	request: NextRequest,
	{ params }: { params: { provider: string } }
) {
	try {
		// Ensure params is properly awaited
		const { provider } = params

		if (!provider) {
			throw new Error('Provider parameter is required')
		}

		// Get the authorization URL
		const authUrl = await oauthService.initiateOAuth(provider)

		// Redirect to the authorization URL
		return NextResponse.redirect(authUrl)
	} catch (error) {
		console.error('OAuth initiation error:', error)
		return NextResponse.redirect(
			new URL('/login?error=oauth_error', request.url)
		)
	}
}
