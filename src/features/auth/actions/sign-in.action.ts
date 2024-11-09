/**
 * @author Remco Stoeten
 * @description Handles the sign-in process for users.
 *
 * This function attempts to sign in a user based on the provided form data.
 * It checks the rate limit for the IP address, verifies the user credentials,
 * and creates a session if the credentials are valid.
 *
 * @param prevState The current state of the authentication process.
 * @param formData The form data containing the user's email and password.
 * @returns A promise that resolves to the updated authentication state.
 */

import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import {
	PasswordService,
	RateLimiterService,
	SessionService
} from '../services'
import type { AuthState } from '../types'

export async function signIn(
	prevState: AuthState,
	formData: FormData
): Promise<AuthState> {
	const ip = (await headers()).get('x-forwarded-for') || 'unknown'
	const authLimiter = RateLimiterService.createAuthLimiter()

	return RateLimiterService.withRateLimit(
		async () => {
			try {
				const email = formData.get('email') as string
				const password = formData.get('password') as string

				const user = await db
					.select()
					.from(users)
					.where(eq(users.email, email.toLowerCase()))
					.get()

				if (
					!user ||
					!(await PasswordService.comparePasswords(
						password,
						user.password
					))
				) {
					return {
						isAuthenticated: false,
						isLoading: false,
						error: {
							_form: ['Invalid credentials']
						}
					}
				}

				const sessionService = new SessionService()
				await sessionService.createSession(
					user.id,
					user.email,
					user.role
				)

				return {
					isAuthenticated: true,
					isLoading: false,
					user: {
						userId: user.id,
						email: user.email,
						role: user.role
					}
				}
			} catch (error) {
				console.error('SignIn error:', error)
				return {
					isAuthenticated: false,
					isLoading: false,
					error: {
						_form: ['Failed to sign in']
					}
				}
			}
		},
		`signin:${ip}`,
		authLimiter
	)
}
