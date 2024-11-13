'use server'

import { activityLogs, profiles, users } from '@/features/authentication'
import bcrypt from 'bcrypt'
import { db } from 'db'
import { headers } from 'next/headers'
import { z } from 'zod'
import { registerSchema } from '../models'

export type RegisterResponse = {
	success: boolean
	error?: string
	userId?: number
}

export async function register(
	email: string,
	password: string,
	confirmPassword: string
): Promise<RegisterResponse> {
	try {
		const { email: validatedEmail, password: validatedPassword } =
			registerSchema.parse({ email, password, confirmPassword })

		const hashedPassword = await bcrypt.hash(validatedPassword, 10)

		// Start transaction
		const result = await db.transaction(async (tx) => {
			// Create user
			const [user] = await tx
				.insert(users)
				.values({
					email: validatedEmail,
					password: hashedPassword,
					role:
						validatedEmail === process.env.ADMIN_EMAIL
							? 'admin'
							: 'user'
				})
				.returning({ id: users.id })

			// Create empty profile
			await tx.insert(profiles).values({
				userId: user.id
			})

			const headersList = await headers()
			const userAgent = headersList.get('user-agent')
			const ip = headersList.get('x-forwarded-for') || 'unknown'

			// Log registration
			await tx.insert(activityLogs).values({
				userId: user.id,
				type: 'account_created',
				status: 'success',
				ipAddress: ip,
				userAgent,
				details: {
					message: 'New account registered'
				}
			})

			return user
		})

		return { success: true, userId: result.id }
	} catch (error) {
		console.error('Registration error:', error)
		if (error instanceof z.ZodError) {
			return { success: false, error: error.errors[0].message }
		}
		// Check for unique constraint violation
		if (
			error instanceof Error &&
			error.message.includes('unique constraint')
		) {
			return { success: false, error: 'Email already exists' }
		}
		return { success: false, error: 'Registration failed' }
	}
}
