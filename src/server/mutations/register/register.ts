'use server'

import { cookies } from 'next/headers'
import { SignJWT } from 'jose'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'
import prisma from '@/server/db'
import type { RegisterResponse } from './types'

export async function register(formData: FormData): Promise<RegisterResponse> {
	try {
		const email = formData.get('email') as string
		const password = formData.get('password') as string
		const firstName = formData.get('firstName') as string
		const lastName = formData.get('lastName') as string

		if (!email || !password) {
			return { success: false, error: 'Email and password are required' }
		}

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({ where: { email } })
		if (existingUser) {
			return { success: false, error: 'Email already registered' }
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10)

		// Create user
		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				firstName: firstName || null,
				lastName: lastName || null,
				name: firstName && lastName ? `${firstName} ${lastName}` : null,
				provider: 'credentials'
			}
		})

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
		console.error('Registration error:', error)
		return {
			success: false,
			error: 'An error occurred during registration'
		}
	}
}
