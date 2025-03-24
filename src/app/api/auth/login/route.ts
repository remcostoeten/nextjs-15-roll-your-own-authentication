import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/server/db'
import { users } from '@/server/db/schema'
import { eq } from 'drizzle-orm'
import { loginSchema } from '@/modules/authentication/models/z.user'
import { comparePasswords } from '@/modules/authentication/utils/password'
import { generateTokens } from '@/modules/authentication/utils/jwt'
import { logUserActivity } from '@/shared/utils/activity-logger'

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const validatedData = loginSchema.parse(body)

		// Find user by email
		const user = await db.query.users.findFirst({
			where: eq(users.email, validatedData.email.toLowerCase()),
		})

		if (!user) {
			await logUserActivity({
				type: 'login_failure',
				userId: 'anonymous',
				details: 'Invalid email or password',
				metadata: {
					email: validatedData.email,
				},
			})

			return NextResponse.json(
				{ message: 'Invalid email or password' },
				{ status: 401 }
			)
		}

		// Verify password
		const isValidPassword = await comparePasswords(
			validatedData.password,
			user.passwordHash
		)

		if (!isValidPassword) {
			await logUserActivity({
				type: 'login_failure',
				userId: user.id,
				details: 'Invalid password',
				metadata: {
					email: user.email,
				},
			})

			return NextResponse.json(
				{ message: 'Invalid email or password' },
				{ status: 401 }
			)
		}

		// Generate tokens
		const tokenPayload = {
			sub: user.id,
			email: user.email,
			role: user.role,
			iat: Math.floor(Date.now() / 1000),
			exp: Math.floor(Date.now() / 1000) + 15 * 60, // 15 minutes
		}

		const tokens = await generateTokens(tokenPayload)

		// Set cookies
		const cookieStore = cookies()
		const cookieOptions = {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax' as const,
			path: '/',
		}

		cookieStore.set('access_token', tokens.accessToken, {
			...cookieOptions,
			maxAge: 15 * 60, // 15 minutes
		})

		cookieStore.set('refresh_token', tokens.refreshToken, {
			...cookieOptions,
			maxAge: 7 * 24 * 60 * 60, // 7 days
		})

		// Log successful login
		await logUserActivity({
			type: 'login_success',
			userId: user.id,
			details: 'User logged in successfully',
			metadata: {
				email: user.email,
				role: user.role,
			},
		})

		// Return user data (excluding sensitive information)
		return NextResponse.json({
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role,
			},
		})
	} catch (error) {
		console.error('Login error:', error)
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		)
	}
}
