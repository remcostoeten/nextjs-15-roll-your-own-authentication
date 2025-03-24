'use server'

import { db } from '@/server/db'
import { users } from '@/server/db/schemas'
import { verifyAccessToken } from '@/shared/utils/jwt/jwt'
import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'

/**
 * Response type for getCurrentUser server action
 */
export type GetCurrentUserResponse = {
	success: boolean
	error?: string
	user?: {
		id: string
		email: string
		firstName: string | null
		lastName: string | null
		role: 'admin' | 'user'
		createdAt: Date
	} | null
}

/**
 * Server action to get the current authenticated user
 * Handles token validation and user retrieval from database
 */
export async function getCurrentUser(): Promise<GetCurrentUserResponse> {
	try {
		const cookieStore = await Promise.resolve(cookies())
		const accessToken = cookieStore.get('access_token')?.value

		if (!accessToken) {
			return {
				success: false,
				error: 'Unauthorized',
				user: null,
			}
		}

		try {
			const payload = await verifyAccessToken(accessToken)
			console.log('Token payload:', payload)

			const user = await db.query.users.findFirst({
				where: eq(users.id, payload.sub),
				columns: {
					id: true,
					email: true,
					firstName: true,
					lastName: true,
					role: true,
					createdAt: true,
				},
			})

			if (!user) {
				return {
					success: false,
					error: 'User not found',
					user: null,
				}
			}

			return {
				success: true,
				user: {
					...user,
					role: user.role as 'admin' | 'user',
				},
			}
		} catch (error) {
			console.error('Token verification or user fetch error:', error)
			return {
				success: false,
				error: 'Invalid token',
				user: null,
			}
		}
	} catch (error) {
		console.error('Get current user error:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'An unexpected error occurred',
			user: null,
		}
	}
}
