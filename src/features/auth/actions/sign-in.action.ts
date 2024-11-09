'use server'

import { db } from '@/db'
import { users } from '@/db/schema'
import { compare } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { generateToken } from '../services/jwt.service'
import type { AuthState } from '../types'

export async function signIn(
	prevState: AuthState,
	formData: FormData
): Promise<AuthState> {
	try {
		const email = formData.get('email')?.toString()
		const password = formData.get('password')?.toString()

		if (!email || !password) {
			return {
				...prevState,
				error: {
					_form: ['Please provide both email and password']
				}
			}
		}

		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.email, email.toLowerCase()))
			.limit(1)

		if (!user) {
			return {
				isAuthenticated: false,
				isLoading: false,
				error: {
					_form: ['Invalid credentials']
				}
			}
		}

		const isValidPassword = await compare(password, user.password)

		if (!isValidPassword) {
			return {
				isAuthenticated: false,
				isLoading: false,
				error: {
					_form: ['Invalid credentials']
				}
			}
		}

		const token = await generateToken({
			userId: user.id,
			email: user.email
		})

		;(await cookies()).set('session', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
			path: '/'
		})

		return {
			isAuthenticated: true,
			isLoading: false,
			success: true,
			user: {
				userId: user.id,
				email: user.email,
				role: user.role
			}
		}
	} catch (error) {
		console.error('Sign in error:', error)
		return {
			isAuthenticated: false,
			isLoading: false,
			error: {
				_form: ['An unexpected error occurred']
			}
		}
	}
}
