'use server'

import bcrypt from 'bcryptjs'
import prisma from '@/server/db'
import { createSession } from '../session'
import type { AuthResponse } from './types'

export async function register(formData: FormData): Promise<AuthResponse> {
	const email = formData.get('email') as string
	const password = formData.get('password') as string
	const firstName = formData.get('firstName') as string
	const lastName = formData.get('lastName') as string

	if (!email || !password || !firstName || !lastName) {
		return { success: false, error: 'All fields are required' }
	}

	try {
		const existingUser = await prisma.user.findUnique({
			where: { email },
			select: { id: true }
		})

		if (existingUser) {
			return { success: false, error: 'Email is already registered' }
		}

		const hashedPassword = await bcrypt.hash(password, 10)
		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				firstName,
				lastName,
				name: `${firstName} ${lastName}`,
				provider: 'credentials'
			},
			select: {
				id: true,
				email: true,
				name: true,
				image: true,
				provider: true,
				emailVerified: true,
				firstName: true,
				lastName: true
			}
		})

		await createSession(user.id).catch(console.error)

		return {
			success: true,
			user: {
				...user,
				image: user.image ?? null,
				provider: user.provider ?? 'credentials',
				emailVerified: user.emailVerified ?? null
			}
		}
	} catch (error) {
		console.error('Registration error:', error)
		return {
			success: false,
			error:
				error instanceof Error ? error.message : 'Registration failed'
		}
	}
}
