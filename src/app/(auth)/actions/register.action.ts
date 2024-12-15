'use server'

import { register } from '@/server/mutations/auth/user'
import type { AuthResponse } from '@/server/mutations/auth/user/types'

export async function registerAction(
	formData: FormData
): Promise<AuthResponse> {
	const email = formData.get('email')?.toString() ?? ''
	const password = formData.get('password')?.toString() ?? ''
	const firstName = formData.get('firstName')?.toString() ?? ''
	const lastName = formData.get('lastName')?.toString() ?? ''

	if (!email || !password || !firstName || !lastName) {
		return {
			success: false,
			error: `Missing required fields`
		}
	}

	try {
		const response = await register(formData)
		return {
			success: response.success ?? false,
			error: response.error,
			user: response.user
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
