'use server'

import { cookies } from 'next/headers'
import { db } from '@/server/db'
import { users } from '@/server/db/schemas'
import { eq } from 'drizzle-orm'
import { generateTokens } from '@/shared/utils/jwt/jwt'
import { userRegistrationSchema } from '@/modules/authentication/models/z.user'
import { hashPassword } from '@/shared/utils/password'
import { env } from 'env'
import { nanoid } from 'nanoid'
import type { User, CreateUser } from '../../models/z.user'

export type RegisterFormState = {
	success: boolean
	message?: string
	user?: {
		id: string
		email: string
		firstName: string | null
		lastName: string | null
		role: 'admin' | 'user'
		avatar: string
	}
}

function isAdminEmail(email: string): boolean {
	return email.toLowerCase() === env.ADMIN_EMAIL?.toLowerCase()
}

function generateDefaultAvatar(email: string, name: string): string {
	// Use Dicebear's Avataaars collection
	const seed = `${email}-${name}-${Date.now()}`
	return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9`
}

export async function registerMutation(userData: CreateUser): Promise<User> {
	const response = await fetch('/api/auth/register', {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(userData),
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message || 'Registration failed')
	}

	const data = await response.json()
	return data.user
}
