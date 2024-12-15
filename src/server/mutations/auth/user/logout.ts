'use server'

import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import prisma from '@/server/db'
import { env } from '@/env'
import { rateLimit, RATE_LIMITS } from '@/server/lib/rate-limit'

const secretKey = new TextEncoder().encode(env.JWT_SECRET)

export async function logout(): Promise<{ success: boolean; error?: string }> {
	const token = (await cookies()).get('token')?.value

	if (!token) {
		return { success: true }
	}

	try {
		// Rate limit logout attempts
		await rateLimit('logout', RATE_LIMITS.auth)

		const { payload } = await jwtVerify(token, secretKey)
		if (
			payload &&
			typeof payload === 'object' &&
			'sessionToken' in payload
		) {
			const sessionToken = payload.sessionToken as string

			// Delete session from database
			await prisma.session
				.delete({
					where: { id: sessionToken }
				})
				.catch((error) => {
					// Log but don't fail if session is already deleted
					console.error(
						'Error deleting session from database:',
						error
					)
				})
		}

		;(await cookies()).delete('token')
		return { success: true }
	} catch (error) {
		console.error('Logout error:', error)
		return { success: false, error: 'Failed to logout' }
	}
}
