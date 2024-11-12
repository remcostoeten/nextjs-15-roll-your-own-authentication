'use server'

import { cookies } from 'next/headers'
import { verifyToken } from './services/jwt.service'
import type { SessionUser } from './types'

export async function getSession(): Promise<SessionUser | null> {
	try {
		const cookieStore = await cookies()
		const sessionCookie = cookieStore.get('session')?.value
		if (!sessionCookie) return null

		const payload = await verifyToken(sessionCookie)
		if (!payload) return null

		return {
			userId: payload.userId,
			email: payload.email,
			role: payload.role
		}
	} catch (error) {
		console.error('Session error:', error)
		return null
	}
}

export async function setSession(userId: string, email: string, role: string) {
	const cookieStore = await cookies()
	const session = { userId, email, role }

	cookieStore.set('session', JSON.stringify(session), {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
	})
}

export async function clearSession() {
	const cookieStore = await cookies()
	cookieStore.delete('session')
}
