// src/features/auth/actions/auth.ts
'use server'

import { db } from '@/db'
import { users } from '@/db/schema'
import { compare, hash } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { AuthState } from '../types'
import { setSession, clearSession, getSession } from '../session'

const signUpSchema = z
	.object({
		email: z.string().email('Invalid email'),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.regex(/[A-Z]/, 'Must contain uppercase')
			.regex(/[0-9]/, 'Must contain number')
			.regex(/[^A-Za-z0-9]/, 'Must contain special character'),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	})

const signInSchema = z.object({
	email: z.string().email('Invalid email'),
	password: z.string().min(1, 'Required')
})

export async function signUp(
	prevState: AuthState,
	formData: FormData
): Promise<AuthState> {
	try {
		const validatedFields = signUpSchema.safeParse({
			email: formData.get('email'),
			password: formData.get('password'),
			confirmPassword: formData.get('confirmPassword')
		})

		if (!validatedFields.success) {
			return {
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
				error: {
					email: ['Email already exists']
				}
			}
		}

		const hashedPassword = await hash(password, 10)

		const [user] = await db
			.insert(users)
			.values({
				email,
				password: hashedPassword
			})
			.returning()

		if (!user?.id) {
			return {
				error: {
					_form: ['Failed to create account']
				}
			}
		}

		await setSession(user.id, user.email)
		redirect('/dashboard')
	} catch (error) {
		console.error('SignUp error:', error)
		return {
			error: {
				_form: ['Failed to create account']
			}
		}
	}
}

export async function signIn(
	prevState: AuthState,
	formData: FormData
): Promise<AuthState> {
	try {
		const validatedFields = signInSchema.safeParse({
			email: formData.get('email'),
			password: formData.get('password')
		})

		if (!validatedFields.success) {
			return {
				error: validatedFields.error.flatten().fieldErrors
			}
		}

		const { email, password } = validatedFields.data

		const user = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.get()

		if (!user) {
			return {
				error: {
					email: ['Email not found']
				}
			}
		}

		const passwordMatch = await compare(password, user.password)

		if (!passwordMatch) {
			return {
				error: {
					_form: ['Invalid credentials']
				}
			}
		}

		await setSession(user.id, user.email)
		redirect('/dashboard')
	} catch (error) {
		console.error('SignIn error:', error)
		return {
			error: {
				_form: ['Failed to sign in']
			}
		}
	}
}

export async function signOut() {
	await clearSession()
	redirect('/sign-in')
}

export async function getAuthState() {
	const session = await getSession()
	return {
		isAuthenticated: !!session,
		email: session?.email
	}
}
