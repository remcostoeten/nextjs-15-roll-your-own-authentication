'use server'

import { getUserData } from '@/app/server/queries'
import { authConfig } from '@/config/auth.config'
import { LoginResponse } from '@/features/authentication/types'
import { compare } from 'bcrypt'
import { randomBytes } from 'crypto'
import { db } from 'db'
import { eq } from 'drizzle-orm'
import { createSession } from '../../helpers'
import { logActivity } from '../../helpers/log-activity'
import { logFailedAttempt } from '../../helpers/log-failed-attempt'
import { users } from '../../users/schema'

export async function login(
	email: string,
	password: string,
	ip?: string,
	userAgent?: string
): Promise<LoginResponse> {
	try {
		if (ip && !checkRateLimit(ip)) {
			return {
				success: false,
				error: authConfig.MESSAGES.RATE_LIMIT_EXCEEDED,
				message: 'Rate limit exceeded',
				remainingAttempts: 0
			}
		}

		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.email, email.toLowerCase()))

		if (!user) {
			await logFailedAttempt({
				email,
				ip,
				reason: authConfig.MESSAGES.INVALID_CREDENTIALS
			})
			return {
				success: false,
				error: authConfig.MESSAGES.INVALID_CREDENTIALS,
				message: 'Login failed',
				remainingAttempts: authConfig.maxLoginAttempts
			}
		}

		const passwordValid = await compare(password, user.password)
		if (!passwordValid) {
			await logFailedAttempt({
				userId: user.id,
				email,
				ip,
				reason: authConfig.MESSAGES.INVALID_CREDENTIALS
			})
			return {
				success: false,
				error: authConfig.MESSAGES.INVALID_CREDENTIALS,
				message: 'Login failed',
				remainingAttempts: authConfig.maxLoginAttempts
			}
		}

		// Generate session token
		const token = randomBytes(32).toString('hex')

		// Set expiration (e.g., 24 hours from now)
		const expiresAt = new Date()
		expiresAt.setHours(expiresAt.getHours() + 24)

		// Basic device info
		const deviceInfo = {
			userAgent,
			timestamp: new Date().toISOString()
		}

		// Create session with all required parameters
		await createSession(
			user.id,
			token,
			expiresAt,
			ip || '',
			userAgent || null,
			deviceInfo
		)

		await logActivity({
			userId: user.id,
			type: 'login',
			status: 'success',
			message: 'Login successful',
			metadata: {
				email
			}
		})

		const userData = await getUserData()

		return {
			success: true,
			message: 'Login successful',
			user: userData
		}
	} catch (error) {
		console.error('Login service error:', error)
		return {
			success: false,
			error: 'An unexpected error occurred',
			message: 'Login failed',
			remainingAttempts: authConfig.maxLoginAttempts
		}
	}
}

function checkRateLimit(ip: string): boolean {
	// Implement your rate limiting logic here
	return true
}
