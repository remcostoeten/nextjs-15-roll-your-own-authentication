'use server'

import { db } from '@/db'
import { users } from '@/db/schema'
import { compare, hash } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { getSession } from '../session'
import { AuthState, SessionUser } from '../types'
import { signInSchema, signUpSchema } from '../validations/models'

type SignUpFormData = {
	email: string
	password: string
	confirmPassword: string
}

type SignInFormData = {
	email: string
	password: string
}

export async function signUp(
	prevState: AuthState,
	formData: FormData
): Promise<AuthState> {
	try {
		const data = {
			email: formData.get('email') as string,
			password: formData.get('password') as string,
			confirmPassword: formData.get('confirmPassword') as string
		} satisfies SignUpFormData

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
			} as typeof users.$inferInsert)
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

		// Assuming you have a separate function to handle session storage
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
		const data = {
			email: formData.get('email') as string,
			password: formData.get('password') as string
		} satisfies SignInFormData

		const validatedFields = signInSchema.safeParse(data)

		if (!validatedFields.success) {
			return {
				isAuthenticated: false,
				isLoading: false,
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
				isAuthenticated: false,
				isLoading: false,
				error: {
					email: ['Email not found']
				}
			}
		}

		const passwordMatch = await compare(password, user.password)

		if (!passwordMatch) {
			return {
				isAuthenticated: false,
				isLoading: false,
				error: {
					_form: ['Invalid credentials']
				}
			}
		}

		// Assuming you have a separate function to handle session storage
		await handleSession(user.id, user.email, user.role)

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
			isLoading: false,
			success: true
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

// Helper function to handle session management
async function handleSession(userId: string, email: string, role: string) {
	await setSession(userId, email, role)
	if (typeof window !== 'undefined') {
		window.dispatchEvent(new Event('auth-change'))
	}
}

export async function getCurrentSession(): Promise<{
	isAuthenticated: boolean
	user?: SessionUser
}> {
	const session = await getSession()

	if (!session) {
		return {
			isAuthenticated: false
		}
	}

	return {
		isAuthenticated: true,
		user: {
			userId: session.userId,
			email: session.email,
			role: session.role ?? 'user'
		}
	}
}
