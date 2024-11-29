'use server'

import { featureFlags } from '@/config/features'
import { registerSchema } from '@/lib/validations/auth'
import { db } from '@/server/db'
import { users } from '@/server/db/schema'
import { hash } from 'bcryptjs'

export async function registerMutation(
	email: string,
	password: string,
	name?: string
) {
	try {
		// Validate input
		const validationResult = registerSchema.safeParse({
			email,
			password,
			name
		})
		if (!validationResult.success) {
			return {
				success: false,
				error: validationResult.error.errors[0].message
			}
		}

		// Check if user exists
		const existingUser = await db.query.users.findFirst({
			where: (users, { eq }) => eq(users.email, email)
		})

		if (existingUser) {
			return {
				success: false,
				error: 'User already exists'
			}
		}

		const hashedPassword = await hash(password, 10)
		const role = email === process.env.ADMIN_EMAIL ? 'admin' : 'user'

		// Generate random avatar using DiceBear
		const seed = Math.random().toString(36).substring(7)
		const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`

		// User is automatically verified if email verification is disabled
		const emailVerified = !featureFlags.emailVerification

		const [newUser] = await db
			.insert(users)
			.values({
				email,
				password: hashedPassword,
				name: name || email.split('@')[0],
				avatar: avatarUrl,
				role,
				emailVerified
			})
			.returning()

		// Only send verification email if feature is enabled
		// if (featureFlags.emailVerification) {
		// 	return {
		// 		success: true,
		// 		message:
		// 			'Registration successful. Please check your email to verify your account.'
		// 	}
		// }

		return {
			success: true,
			message: 'Registration successful. You can now log in.'
		}
	} catch (error) {
		console.error('Registration error:', error)
		return {
			success: false,
			error: 'Failed to register user'
		}
	}
}
