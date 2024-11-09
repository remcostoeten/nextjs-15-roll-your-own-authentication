/**
 * @author Remco Stoeten
 * @description Handles the sign-up process for users.
 *
 * This function attempts to sign up a user based on the provided form data.
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
import { signUpSchema } from '../validations/models'

export async function signUp(
	prevState: AuthState,
	formData: FormData
): Promise<AuthState> {
	const ip = headers().get('x-forwarded-for') || 'unknown'
	const formLimiter = RateLimiterService.createFormLimiter()

	return RateLimiterService.withRateLimit(
		async () => {
			try {
				const data = {
					email: formData.get('email') as string,
					password: formData.get('password') as string,
					confirmPassword: formData.get('confirmPassword') as string
				}

				const validatedFields = signUpSchema.safeParse(data)

				if (!validatedFields.success) {
					return {
						isAuthenticated: false,
						isLoading: false,
						error: validatedFields.error.flatten().fieldErrors
					}
				}

				const { email, password } = validatedFields.data

				const existingUser = await db
					.select()
					.from(users)
					.where(eq(users.email, email))
					.get()

				if (existingUser) {
					return {
						isAuthenticated: false,
						isLoading: false,
						error: {
							email: ['Email already exists']
						}
					}
				}

				const hashedPassword =
					await PasswordService.hashPassword(password)
				const normalizedEmail = email.toLowerCase().trim()
				const normalizedAdminEmail =
					process.env.ADMIN_EMAIL?.toLowerCase().trim() || ''
				const isAdmin = normalizedEmail === normalizedAdminEmail
				const userRole = isAdmin ? 'admin' : 'user'

				const [user] = await db
					.insert(users)
					.values({
						email: normalizedEmail,
						password: hashedPassword,
						role: userRole
					} as {
						email: string
						password: string
						role: string
					})
					.returning()

				if (!user?.id) {
					return {
						isAuthenticated: false,
						isLoading: false,
						error: {
							_form: ['Failed to create account']
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
				console.error('SignUp error:', error)
				return {
					isAuthenticated: false,
					isLoading: false,
					error: {
						_form: ['Failed to create account']
					}
				}
			}
		},
		`signup:${ip}`,
		formLimiter
	)
}
