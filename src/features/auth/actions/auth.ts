'use server'

import { db } from '@/db'
import { users } from '@/db/schema'
import { compare, hash } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { clearSession, setSession } from '../session'
import type { AuthState } from '../types'
import { signUpSchema } from '../validations/models'

export async function signUp(
	prevState: AuthState,
	formData: FormData
): Promise<AuthState> {
	try {
		const data = {
			email: formData.get('email') as string,
			password: formData.get('password') as string,
			confirmPassword: formData.get('confirmPassword') as string
		}

		const validatedFields = signUpSchema.safeParse(data)

		if (!validatedFields.success) {
			return {
				isAuthenticated: false,
				isLoading: false,
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
				isAuthenticated: false,
				isLoading: false,
				error: {
					email: ['Email already exists']
				}
			}
		}

		const hashedPassword = await hash(password, 10)
		const normalizedEmail = email.toLowerCase().trim()
		const normalizedAdminEmail =
			process.env.ADMIN_EMAIL?.toLowerCase().trim() || ''
		const isAdmin = normalizedEmail === normalizedAdminEmail
		const userRole = isAdmin ? 'admin' : 'user'

		const [user] = await db
			.insert(users)
			.values({
				email: normalizedEmail,
				password: hashedPassword,
				role: userRole
			} satisfies typeof users.$inferInsert)
			.returning()

		if (!user?.id) {
			return {
				isAuthenticated: false,
				isLoading: false,
				error: {
					_form: ['Failed to create account']
				}
			}
		}

		await handleSession(user.id, user.email, user.role)

		return {
			isAuthenticated: true,
			isLoading: false,
			user: {
				userId: user.id,
				email: user.email,
				role: user.role
			}
		}
	} catch (error) {
		console.error('SignUp error:', error)
		return {
			isAuthenticated: false,
			isLoading: false,
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
		const email = formData.get('email') as string
		const password = formData.get('password') as string

		const user = await db
			.select()
			.from(users)
			.where(eq(users.email, email.toLowerCase()))
			.get()

		if (!user || !(await compare(password, user.password))) {
			return {
				isAuthenticated: false,
				isLoading: false,
				error: {
					_form: ['Invalid credentials']
				}
			}
		}

		await handleSession(user.id, user.email, user.role)

		return {
			isAuthenticated: true,
			isLoading: false,
			user: {
				userId: user.id,
				email: user.email,
				role: user.role
			}
		}
	} catch (error) {
		console.error('SignIn error:', error)
		return {
			isAuthenticated: false,
			isLoading: false,
			error: {
				_form: ['Failed to sign in']
			}
		}
	}
}

export async function signOut(): Promise<AuthState> {
	try {
		await clearSession()

		return {
			isAuthenticated: false,
			isLoading: false
		}
	} catch (error) {
		console.error('SignOut error:', error)
		return {
			isAuthenticated: false,
			isLoading: false,
			error: {
				_form: ['Failed to sign out']
			}
		}
	}
}

async function handleSession(userId: string, email: string, role: string) {
	await setSession(userId, email, role)
	if (typeof window !== 'undefined') {
		window.dispatchEvent(new Event('auth-change'))
	}
}
