import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SignJWT } from 'jose'
import prisma from '@/server/db'

const secretKey = new TextEncoder().encode(
	process.env.JWT_SECRET || 'your-secret-key'
)

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams
	const code = searchParams.get('code')
	const state = searchParams.get('state')

	// Verify state
	const storedState = (await cookies()).get('oauth_state')?.value
	if (state !== storedState) {
		return NextResponse.redirect(
			`${process.env.NEXT_PUBLIC_APP_URL}/login?error=Invalid state`
		)
	}

	try {
		// Exchange code for token
		const tokenResponse = await fetch(
			'https://oauth2.googleapis.com/token',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: new URLSearchParams({
					code: code!,
					client_id: process.env.GOOGLE_CLIENT_ID!,
					client_secret: process.env.GOOGLE_CLIENT_SECRET!,
					redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
					grant_type: 'authorization_code'
				})
			}
		)

		if (!tokenResponse.ok) {
			throw new Error('Failed to exchange code for token')
		}

		const tokenData = await tokenResponse.json()

		// Get user info
		const userResponse = await fetch(
			'https://www.googleapis.com/oauth2/v2/userinfo',
			{
				headers: { Authorization: `Bearer ${tokenData.access_token}` }
			}
		)

		if (!userResponse.ok) {
			throw new Error('Failed to fetch user info')
		}

		const userData = await userResponse.json()

		// Find or create user
		let user = await prisma.user.findUnique({
			where: { email: userData.email }
		})

		if (!user) {
			user = await prisma.user.create({
				data: {
					email: userData.email,
					name: userData.name,
					image: userData.picture,
					provider: 'google'
				}
			})
		}

		// Create JWT
		const token = await new SignJWT({ userId: user.id })
			.setProtectedHeader({ alg: 'HS256' })
			.setExpirationTime('1h')
			.sign(secretKey)

		// Set cookie and redirect
		;(
			await // Set cookie and redirect
			cookies()
		).set('token', token, { httpOnly: true })
		return NextResponse.redirect(
			`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
		)
	} catch (error) {
		console.error('Google auth error:', error)
		return NextResponse.redirect(
			`${process.env.NEXT_PUBLIC_APP_URL}/login?error=Authentication failed`
		)
	}
}
