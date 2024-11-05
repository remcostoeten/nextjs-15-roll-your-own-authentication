'use server'

import { db } from '@/db'
import { users } from '@/db/schema'
import { compare, hash } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { clearSession, getSession, setSession } from '../session'
import { AuthState, SessionUser } from '../types'
import { signInSchema, signUpSchema } from '../validations/models'

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

		// Normalize emails for comparison
		const normalizedEmail = email.toLowerCase().trim()
		const normalizedAdminEmail =
			process.env.ADMIN_EMAIL?.toLowerCase().trim() || ''

		// Debug logs
		console.log('Signup - Normalized user email:', normalizedEmail)
		console.log('Signup - Normalized admin email:', normalizedAdminEmail)

		const isAdmin = normalizedEmail === normalizedAdminEmail
		const role = isAdmin ? 'admin' : 'user'

		console.log('Signup - Assigned role:', role)

		const [user] = await db
			.insert(users)
			.values({
				email: normalizedEmail,
				password: hashedPassword,
				role: role
			})
			.returning()

		if (!user?.id) {
			return {
				error: {
					_form: ['Failed to create account']
				}
			}
		}

		await setSession(user.id, user.email, user.role)

		if (typeof window !== 'undefined') {
			window.dispatchEvent(new Event('auth-change'))
		}

		return {
			redirect: '/dashboard'
		}
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

		await setSession(user.id, user.email, user.role)

		// Add this line to dispatch the event
		if (typeof window !== 'undefined') {
			window.dispatchEvent(new Event('auth-change'))
		}

		return {
			redirect: '/dashboard'
		}
	} catch (error) {
		console.error('SignIn error:', error)
		return {
			error: {
				_form: ['Failed to sign in']
			}
		}
	}
}

export async function signOut(): Promise<AuthState> {
	try {
		await clearSession()

		if (typeof window !== 'undefined') {
			window.dispatchEvent(new Event('auth-change'))
		}

		return {
			redirect: '/sign-in'
		}
	} catch (error) {
		console.error('SignOut error:', error)
		return {
			error: {
				_form: ['Failed to sign out']
			}
		}
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
