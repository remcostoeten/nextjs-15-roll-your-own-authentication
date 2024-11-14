// features/authentication/services/auth/register.ts
'use server'

import { registerSchema } from '@/app/server/models'
import { profiles, users } from '@/app/server/schema'
import { authConfig } from '@/config'
import { RegisterResponse } from '@/features/authentication/types'
import bcrypt from 'bcrypt'
import { db } from 'db'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { headers } from 'next/headers'
import { z } from 'zod'
import { logRegistration } from '../../helpers/log-activity'

async function createUserProfile(userId: number, tx: PostgresJsDatabase) {
	await tx.insert(profiles).values({ userId })
}

export async function register(
	name: string,
	email: string,
	password: string
): Promise<RegisterResponse> {
	try {
		const validatedData = registerSchema.parse({
			name,
			email,
			password,
			confirmPassword: password
		})

		const hashedPassword = await bcrypt.hash(validatedData.password, 10)
		const headersList = await headers()
		const userAgent = headersList.get('user-agent')
		const ip = headersList.get('x-forwarded-for') || 'unknown'

		const result = await db.transaction(async (tx) => {
			const [user] = await tx
				.insert(users)
				.values({
					email: validatedData.email,
					password: hashedPassword,
					role:
						validatedData.email === process.env.ADMIN_EMAIL
							? 'admin'
							: 'user'
				})
				.returning({ id: users.id })

			await Promise.all([
				createUserProfile(user.id, tx),
				logRegistration(user.id, {
					message: authConfig.MESSAGES.ACCOUNT_CREATED,
					timestamp: new Date().toString()
				})
			])

			return user
		})

		return { success: true, userId: result.id }
	} catch (error) {
		console.log(error)

		if (error instanceof z.ZodError) {
			console.log('d')
			return { success: false, error: error.errors[0].message }
		}
		console.error('Registration error:', error)
		return { success: false, error: 'Registration failed' }
	}
}
