'use server'

import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import prisma from '@/server/db'
import type { UserResponse } from './types'

export async function getUser(): Promise<UserResponse> {
	const cookieStore = await cookies()
	const token = cookieStore.get('token')?.value

	if (!token) return null

	try {
		const secretKey = new TextEncoder().encode(
			process.env.JWT_SECRET || 'your-secret-key'
		)
		const { payload } = await jwtVerify(token, secretKey)

		if (payload && typeof payload === 'object' && 'userId' in payload) {
			return await prisma.user.findUnique({
				where: { id: payload.userId as number },
				select: {
					id: true,
					email: true,
					firstName: true,
					lastName: true,
					name: true,
					image: true,
					provider: true
				}
			})
		}
		return null
	} catch (error) {
		console.error('Get user error:', error)
		return null
	}
}
