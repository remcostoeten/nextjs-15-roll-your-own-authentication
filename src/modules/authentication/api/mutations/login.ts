'use server'

import { cookies } from 'next/headers'
import { z } from 'zod'
import { db } from 'db'
import { setAuthCookies } from '@/modules/authentication/utils/auth-cookies'
import { logUserActivity } from '@/shared/utils/activity-logger'
import { comparePasswords } from '@/modules/authentication/utils/password'
import { ActivityType } from '@/shared/utils/activity-logger'
import type { User, LoginCredentials } from '../../models/z.user'

export type LoginFormState = {
	success: boolean
	message: string | null
	user?: {
		id: string
		email: string
		firstName: string | null
		lastName: string | null
		role: 'admin' | 'user'
	}
}

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	userAgent: z.string(),
})

export async function loginMutation(credentials: LoginCredentials): Promise<User> {
	const response = await fetch('/api/auth/login', {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(credentials),
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message || 'Login failed')
	}

	const data = await response.json()
	return data.user
}
