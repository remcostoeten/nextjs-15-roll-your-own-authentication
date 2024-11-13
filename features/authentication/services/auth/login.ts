'use server'

import { loginSchema } from '@/app/server/models'
import {
	getBrowserInfo,
	getOSInfo,
	isMobileDevice,
	JWT_SECRET
} from '@/app/server/utilities'
import { authConfig } from '@/config'
import { users } from '@/features/authentication'
import bcrypt from 'bcrypt'
import { db } from 'db'
import { eq } from 'drizzle-orm'
import { SignJWT } from 'jose'
import { cookies, headers } from 'next/headers'
import { z } from 'zod'
import {
	createSession,
	logFailedAttempt,
	logSuccessfulLogin,
	resetLoginAttempts
} from '../../helpers'
import { LoginResponse } from '../../types'
import { checkRateLimit } from './rate-limit'

export async function login(
	email: string,
	password: string
): Promise<LoginResponse> {
	try {
		const headersList = await headers()
		const ip = headersList.get('x-forwarded-for') || 'unknown'

		if (!checkRateLimit(ip)) {
			return {
				success: false,
				error: authConfig.MESSAGES.RATE_LIMIT_EXCEEDED
			}
		}

		const { email: validatedEmail, password: validatedPassword } =
			loginSchema.parse({ email, password })

		const user = await db
			.select()
			.from(users)
			.where(eq(users.email, validatedEmail))
			.limit(1)

		if (user.length === 0) {
			const tempUserId = -1
			await logFailedAttempt({
				userId: tempUserId,
				error: 'User not found'
			})
			return {
				success: false,
				error: authConfig.MESSAGES.INVALID_CREDENTIALS
			}
		}

		const isPasswordValid = await bcrypt.compare(
			validatedPassword,
			user[0].password
		)
		if (!isPasswordValid) {
			await logFailedAttempt({
				userId: user[0].id,
				error: 'Invalid password'
			})
			return {
				success: false,
				error: authConfig.MESSAGES.INVALID_CREDENTIALS
			}
		}

		const token = await new SignJWT({ userId: user[0].id })
			.setProtectedHeader({ alg: authConfig.JWT.ALGORITHM })
			.setIssuedAt()
			.setExpirationTime('24h')
			.sign(JWT_SECRET)

		const expiresAt = new Date(Date.now() + authConfig.sessionDuration)
		const userAgent = headersList.get('user-agent')

		const deviceInfo = {
			browser: getBrowserInfo(userAgent),
			os: getOSInfo(userAgent),
			isMobile: isMobileDevice(userAgent)
		}

		await Promise.all([
			createSession(
				user[0].id,
				token,
				expiresAt,
				ip,
				userAgent,
				deviceInfo
			),
			logSuccessfulLogin(user[0].id, ip, userAgent),
			resetLoginAttempts(user[0].id)
		])

		const cookieStore = await cookies()
		cookieStore.set(authConfig.cookieName, token, {
			...authConfig.COOKIE_OPTIONS,
			expires: expiresAt
		})

		return { success: true }
	} catch (error) {
		if (error instanceof z.ZodError) {
			return { success: false, error: error.errors[0].message }
		}
		console.error('Login error:', error)
		return { success: false, error: authConfig.MESSAGES.LOGIN_FAILED }
	}
}
