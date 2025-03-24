import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/server/db'
import { users } from '@/server/db/schema'
import { createUserSchema } from '@/modules/authentication/models/z.user'
import { hashPassword } from '@/modules/authentication/utils/password'
import { generateTokens } from '@/modules/authentication/utils/jwt'
import { logUserActivity } from '@/shared/utils/activity-logger'

export async function POST(request: Request) {
	try {
		const body = await request.json()
		const validatedData = createUserSchema.parse(body)

		// Check if user already exists
		const existingUser = await db.query.users.findFirst({
			where: (users, { eq }) => eq(users.email, validatedData.email.toLowerCase()),
		})

		if (existingUser) {
			await logUserActivity({
				type: 'register_failure',
				userId: 'anonymous',
				details: 'Email already exists',
				metadata: {
					email: validatedData.email,
				},
			})

			return NextResponse.json({ message: 'Email already exists' }, { status: 400 })
		}

		// Hash password
		const passwordHash = await hashPassword(validatedData.password)

		// Create user
		const [user] = await db
			.insert(users)
			.values({
				email: validatedData.email.toLowerCase(),
				name: validatedData.name,
				passwordHash,
				role: validatedData.role,
			})
			.returning()

		if (!user) {
			throw new Error('Failed to create user')
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

		// Log successful registration
		await logUserActivity({
			type: 'register_success',
			userId: user.id,
			details: 'User registered successfully',
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
		console.error('Registration error:', error)
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
	}
}
