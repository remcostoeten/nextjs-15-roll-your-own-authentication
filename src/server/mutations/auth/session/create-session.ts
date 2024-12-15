'use server'

import { SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'
import prisma from '@/server/db'
import { env } from '@/env'
import { rateLimit } from '@/server/lib/rate-limit'
import type { JWTPayload } from './types'

const secretKey = new TextEncoder().encode(env.JWT_SECRET)
const SESSION_TTL = 30 * 24 * 60 * 60 // 30 days in seconds

export async function createSession(userId: number): Promise<void> {
	// Rate limit session creation
	await rateLimit(`session:create:${userId}`, {
		interval: 300,
		maxRequests: 5
	})

	const sessionToken = uuidv4()
	const expiresAt = new Date(Date.now() + SESSION_TTL * 1000)

	// Store session in database
	await prisma.session.create({
		data: {
			id: sessionToken,
			userId,
			expiresAt
		}
	})

	const payload: JWTPayload = {
		userId,
		sessionToken,
		type: 'session'
	}

	const token = await new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setExpirationTime(expiresAt.getTime() / 1000)
		.sign(secretKey)

	;(await cookies()).set('token', token, {
		httpOnly: true,
		expires: expiresAt,
		secure: env.NODE_ENV === 'production',
		sameSite: 'lax'
	})
}
