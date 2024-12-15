'use server'

import { cookies } from 'next/headers'
import { SignJWT } from 'jose'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'
import prisma from '@/server/db'
import { AUTH_COOKIE_NAME, secretKey } from '@/core/config/auth'
import type { AuthResponse, User } from './types'

export async function login(formData: FormData): Promise<AuthResponse> {
	const email = formData.get('email') as string
	const password = formData.get('password') as string

	if (!email || !password) {
		return { success: false, error: 'Email and password are required' }
	}

	try {
		const user = await prisma.user.findUnique({
			where: { email },
			select: {
				id: true,
				email: true,
				password: true,
				firstName: true,
				lastName: true,
				name: true,
				image: true,
				provider: true,
				emailVerified: true
			}
		})

		if (
			!user?.password ||
			!(await bcrypt.compare(password, user.password))
		) {
			return { success: false, error: 'Invalid credentials' }
		}

		// Create session
		const sessionToken = uuidv4()
		const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

		await prisma.session.create({
			data: {
				id: sessionToken,
				userId: user.id,
				expiresAt
			}
		})

		// Create JWT
		const token = await new SignJWT({
			userId: user.id,
			sessionToken,
			type: 'session'
		})
			.setProtectedHeader({ alg: 'HS256' })
			.setExpirationTime(expiresAt.getTime() / 1000)
			.sign(secretKey)

		// Set cookie
		const cookieStore = await cookies()
		cookieStore.set(AUTH_COOKIE_NAME, token, {
			httpOnly: true,
			expires: expiresAt,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			path: '/'
		})

		// Return user without sensitive data
		const userResponse: User = {
			id: user.id,
			email: user.email,
			firstName: user.firstName ?? null,
			lastName: user.lastName ?? null,
			name: user.name ?? null,
			image: user.image ?? null,
			provider: user.provider ?? 'credentials',
			emailVerified: user.emailVerified
		}

		return {
			success: true,
			user: userResponse
		}
	} catch (error) {
		console.error('Login error:', error)
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: 'An unexpected error occurred during login'
		}
	}
}
