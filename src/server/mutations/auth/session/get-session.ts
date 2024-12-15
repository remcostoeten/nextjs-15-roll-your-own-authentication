'use server'

import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import prisma from '@/server/db'
import { env } from '@/env'
import { rateLimit, RATE_LIMITS } from '@/server/lib/rate-limit'
import type { SessionResponse } from './types'

const secretKey = new TextEncoder().encode(env.JWT_SECRET)

export async function getSession(): Promise<SessionResponse | null> {
	const token = (await cookies()).get('token')?.value

	if (!token) return null

	try {
		const { payload } = await jwtVerify(token, secretKey)
		if (
			payload &&
			typeof payload === 'object' &&
			'sessionToken' in payload
		) {
			const sessionToken = payload.sessionToken as string

			// Rate limit session checks
			await rateLimit(
				`session:get:${sessionToken}`,
				RATE_LIMITS.sessions.get
			)

			// Get session from database
			const session = await prisma.session.findUnique({
				where: { id: sessionToken }
			})

			if (session) {
				// Check if session is expired
				if (session.expiresAt < new Date()) {
					await prisma.session.delete({ where: { id: sessionToken } })
					return null
				}
				return session
			}
		}
		return null
	} catch (error) {
		console.error('Get session error:', error)
		return null
	}
}
