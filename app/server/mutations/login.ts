/**
 * @author Remco Stoeten
 * @description A React component for login functionality.
 *
 */

'use server'

import { login as loginService } from '@/features/authentication/services/auth/login'
import { LoginResponse } from '@/features/authentication/types'
import {
	checkRateLimit,
	incrementLoginAttempts,
	resetLoginAttempts
} from '../services/auth/rate-limit'

export async function login(
	email: string,
	password: string
): Promise<LoginResponse> {
	try {
		// Check rate limiting
		const rateLimit = await checkRateLimit(email)

		if (rateLimit.blocked) {
			return {
				success: false,
				message: `Too many login attempts`,
				error: `Please try again after ${rateLimit.blockedUntil?.toLocaleString()}`,
				remainingAttempts: 0
			}
		}

		const result = await loginService(email, password)

		if (result.success) {
			// Reset attempts on successful login
			await resetLoginAttempts(email)
			return result
		} else {
			// Increment attempts on failed login
			await incrementLoginAttempts(email)

			// Get updated rate limit info
			const updatedLimit = await checkRateLimit(email)

			return {
				success: false,
				error: `Invalid email or password. ${updatedLimit.remainingAttempts} attempts remaining.`,
				remainingAttempts: updatedLimit.remainingAttempts
			}
		}
	} catch (error) {
		console.error('Login error:', error)
		return {
			success: false,
			error: 'An unexpected error occurred',
			message: 'Login failed'
		}
	}
}
