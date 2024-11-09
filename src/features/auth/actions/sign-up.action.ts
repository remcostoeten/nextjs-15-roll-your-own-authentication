'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { generateToken } from '../services/jwt.service'
import { createUser } from '../services/user.service'
import type { AuthState } from '../types'
import { signUpSchema } from '../validations/models/sign-up.z'

const initialState: AuthState = {
	isAuthenticated: false,
	isLoading: false
}

export async function signUp(
	prevState: AuthState = initialState,
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
				...prevState,
				error: {
					_form: ['Invalid form data'],
					...Object.fromEntries(
						Object.entries(
							validatedFields.error.flatten().fieldErrors
						).map(([key, value]) => [key, value ?? []])
					)
				}
			}
		}

		const user = await createUser({
			email: validatedFields.data.email,
			password: validatedFields.data.password
		})

		const token = await generateToken({
			userId: user.id,
			email: user.email
		})

		const cookieStore = await cookies()
		cookieStore.set('session', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
			path: '/'
		})

		redirect('/dashboard')
	} catch (error) {
		console.error('Signup error:', error)
		return {
			...prevState,
			error: {
				_form: ['Something went wrong during signup.']
			}
		}
	}
}
