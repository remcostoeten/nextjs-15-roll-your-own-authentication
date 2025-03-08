import { NextRequest, NextResponse } from 'next/server'
import { registerUser } from '@/modules/authentication/api/mutations/register-user'
import { env } from 'env'

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()

		// Get request info (optional)
		const userAgent = request.headers.get('user-agent') || undefined
		const ipAddress =
			request.headers.get('x-forwarded-for') ||
			request.headers.get('x-real-ip') ||
			undefined

		// Call the register function
		const result = await registerUser(body, { userAgent, ipAddress })

		// Create a response
		const response = NextResponse.json(result, { status: 201 })

		// Set cookies for automatic sign-in
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
		console.error('Registration error:', error)
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: 'An error occurred during registration',
			},
			{ status: 400 }
		)
	}
}
