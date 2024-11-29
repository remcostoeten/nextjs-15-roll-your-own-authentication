'use server'

import { featureFlags } from '@/config/features'
import { registerSchema } from '@/lib/validations/auth'
import { db } from '@/server/db'
import { users } from '@/server/db/schema'
import { hash } from 'bcrypt'

export async function register(email: string, password: string, name?: string) {
	try {
		const validationResult = registerSchema.safeParse({
			email,
			password,
			name
		})
		if (!validationResult.success) {
			return {
				success: false,
				message: validationResult.error.errors[0].message
			}
		}

		const existingUser = await db.query.users.findFirst({
			where: (users, { eq }) => eq(users.email, email)
		})

		if (existingUser) {
			return {
				success: false,
				message: 'User already exists'
			}
		}

		const hashedPassword = await hash(password, 10)
		const role = email === process.env.ADMIN_EMAIL ? 'admin' : 'user'

		// User is automatically verified if email verification is disabled
		const emailVerified = !featureFlags.emailVerification

		const [newUser] = await db
			.insert(users)
			.values({
				email,
				password: hashedPassword,
				name,
				role,
				emailVerified
			})
			.returning()

		// Only send verification email if feature is enabled
		// if (featureFlags.emailVerification) {
		// 	await sendVerificationEmail(newUser.id, email)
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
			message: 'Failed to register user'
		}
	}
}
