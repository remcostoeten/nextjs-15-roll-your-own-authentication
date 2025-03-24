import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/shared/utils/jwt/jwt'

/**
 * API route to verify the current token
 * Used by client-side authentication hooks
 */
export async function GET(request: NextRequest) {
	try {
		// Get the access token from cookies
		const accessToken = request.cookies.get('access_token')?.value

		if (!accessToken) {
			return NextResponse.json({ isValid: false, error: 'No token provided' }, { status: 401 })
		}

		// Verify the token
		const payload = await verifyAccessToken(accessToken)

		return NextResponse.json({
			isValid: true,
			user: {
				id: payload.sub,
				email: payload.email,
			},
		})
	} catch (error) {
		return NextResponse.json(
			{
				isValid: false,
				error: error instanceof Error ? error.message : 'Invalid token',
			},
			{ status: 401 }
		)
	}
}
