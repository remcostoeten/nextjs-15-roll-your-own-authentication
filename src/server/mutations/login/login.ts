'use server'

import { cookies } from 'next/headers'
import { SignJWT } from 'jose'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'
import prisma from '@/server/db'
import type { LoginResponse } from './types'

export async function login(formData: FormData): Promise<LoginResponse> {
	try {
		const email = formData.get('email') as string
		const password = formData.get('password') as string

		if (!email || !password) {
			return { success: false, error: 'Email and password are required' }
		}

		const user = await prisma.user.findUnique({ where: { email } })

		if (!user || !user.password) {
			return { success: false, error: 'Invalid credentials' }
		}

		const isValid = await bcrypt.compare(password, user.password)

		if (!isValid) {
			return { success: false, error: 'Invalid credentials' }
		}

		// Create session
		const sessionToken = uuidv4()
		const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

		await prisma.session.create({
			data: {
				id: sessionToken,
				userId: user.id,
				expiresAt
			}
		})

		// Create JWT
		const secretKey = new TextEncoder().encode(
			process.env.JWT_SECRET || 'your-secret-key'
		)
		const token = await new SignJWT({
			userId: user.id,
			sessionToken,
			type: 'session'
		})
			.setProtectedHeader({ alg: 'HS256' })
			.setExpirationTime(expiresAt.getTime() / 1000)
			.sign(secretKey)

		const cookieStore = await cookies()
		cookieStore.set('token', token, {
			httpOnly: true,
			expires: expiresAt,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax'
		})

		return {
			success: true,
			user: {
				id: user.id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				name: user.name,
				image: user.image,
				provider: user.provider
			}
		}
	} catch (error) {
		console.error('Login error:', error)
		return { success: false, error: 'An error occurred during login' }
	}
}
