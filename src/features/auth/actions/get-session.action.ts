'use server'

import { cookies } from 'next/headers'
import { verifyToken } from '../services/jwt.service'
import type { SessionUser } from '../types'

export async function getSession(): Promise<SessionUser | null> {
	try {
		const cookieStore = await cookies()
		const sessionCookie = cookieStore.get('session')?.value

		if (!sessionCookie) {
			return null
		}

		const payload = await verifyToken(sessionCookie)
		if (!payload) {
			return null
		}

		return {
			userId: payload.userId,
			email: payload.email
		}
	} catch {
		return null
	}
}
