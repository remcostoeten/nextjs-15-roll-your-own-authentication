'use server'

import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import prisma from '@/server/db'
import { AUTH_COOKIE_NAME } from '@/server/mutations/auth/oauth/constants'
import type { User } from './types'

const secretKey = new TextEncoder().encode(
	process.env.JWT_SECRET || 'your-secret-key'
)

export async function getUser(): Promise<User | null> {
	const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value

	if (!token) return null

	try {
		const { payload } = await jwtVerify(token, secretKey)
		if (payload && typeof payload === 'object' && 'userId' in payload) {
			const user = await prisma.user.findUnique({
				where: { id: payload.userId as number }
			})

			if (!user) return null

			// Return only the necessary user fields
			return {
				id: user.id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				name: user.name,
				image: user.image,
				provider: user.provider,
				emailVerified: user.emailVerified
			}
		}
		return null
	} catch (error) {
		console.error('Get user error:', error)
		return null
	}
}
