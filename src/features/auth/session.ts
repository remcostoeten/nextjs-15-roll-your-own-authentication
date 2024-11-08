'use server'

import { cookies } from 'next/headers'
import { SessionUser } from './types'

export async function getSession(): Promise<SessionUser | null> {
	const sessionCookie = cookies().get('session')
	if (!sessionCookie) return null

	try {
		// Implement your session validation logic here
		const session = JSON.parse(sessionCookie.value)
		return session
	} catch {
		return null
	}
}
