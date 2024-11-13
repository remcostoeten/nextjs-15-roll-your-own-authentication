/**
 * @author Remco Stoeten
 * @description A React component for login functionality.
 *
 */

'use server'

import { login as loginService } from '@/features/authentication/services/auth/login'
import { LoginResponse } from '@/features/authentication/types.d'
import {
	checkRateLimit,
	incrementLoginAttempts,
	resetLoginAttempts
} from '../services/auth/rate-limit'

export async function login(
	email: string,
	password: string
): Promise<LoginResponse> {
	// Check rate limit before attempting login
	const rateLimit = await checkRateLimit(email)

	if (rateLimit.blocked) {
		return {
			success: false,
			error: `Too many login attempts. Please try again after ${rateLimit.blockedUntil?.toLocaleString()}`,
			remainingAttempts: 0
		}
	}

	try {
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
	} catch {
		// Increment attempts on error
		await incrementLoginAttempts(email)

		// Get updated rate limit info
		const updatedLimit = await checkRateLimit(email)

		return {
			success: false,
			error: `Login failed. ${updatedLimit.remainingAttempts} attempts remaining.`,
			remainingAttempts: updatedLimit.remainingAttempts
		}
	}
}
