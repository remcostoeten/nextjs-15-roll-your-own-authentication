'use server'

import { cookies } from 'next/headers'
import type { SessionUser } from './types'

export async function getSession(): Promise<SessionUser | null> {
	const cookieStore = await cookies()
	const sessionCookie = cookieStore.get('session')
	if (!sessionCookie) return null

	try {
		const session = JSON.parse(sessionCookie.value)
		if (!session.userId || !session.email || !session.role) {
			return null
		}
		return session as SessionUser
	} catch (error) {
		console.error('Session parsing error:', error)
		return null
	}
}

export async function setSession(userId: string, email: string, role: string) {
	const cookieStore = cookies()
	const session = { userId, email, role }

	cookieStore.set('session', JSON.stringify(session), {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
	})
}

export async function clearSession() {
	const cookieStore = cookies()
	cookieStore.delete('session')
}
