'use server'

import { login } from '@/server/mutations/auth/user'
import type { AuthResponse } from '@/server/mutations/auth/user/types'

export async function loginAction(formData: FormData): Promise<AuthResponse> {
	const email = formData.get('email')?.toString() ?? ''
	const password = formData.get('password')?.toString() ?? ''

	if (!email || !password) {
		return {
			success: false,
			error: 'Email and password are required'
		}
	}

	try {
		return await login(formData)
	} catch (error) {
		console.error('Login error:', error)
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: 'An unexpected error occurred during login'
		}
	}
}
