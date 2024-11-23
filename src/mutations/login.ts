'use server'

import bcryptjs from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { createEntity } from '../server/db/generics/entity'
import { sessions, users } from '../server/db/schema'

const userEntity = createEntity(users)
const sessionEntity = createEntity(sessions)

const SECRET_KEY = process.env.JWT_SECRET_KEY!
const key = new TextEncoder().encode(SECRET_KEY)

export async function loginMutation(email: string, password: string) {
	try {
		const [user] = await userEntity.read(eq(users.email, email))

		if (!user) {
			return { success: false, error: 'Invalid email or password' }
		}

		const passwordMatch = await bcryptjs.compare(password, user.password)

		if (!passwordMatch) {
			return { success: false, error: 'Invalid email or password' }
		}

		if (!user.emailVerified) {
			return {
				success: false,
				error: 'Please verify your email before logging in'
			}
		}

		const token = await new SignJWT({ userId: user.id })
			.setProtectedHeader({ alg: 'HS256' })
			.setExpirationTime('1h')
			.sign(key)

		const oneHour = 60 * 60 * 1000
		const expiresAt = new Date(Date.now() + oneHour)

		await sessionEntity.create({
			userId: user.id,
			token,
			expiresAt
		})
		;(await cookies()).set('auth_token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production'
		})

		return { success: true }
	} catch (error) {
		console.error('Login error:', error)
		return { success: false, error: 'An error occurred during login' }
	}
}
