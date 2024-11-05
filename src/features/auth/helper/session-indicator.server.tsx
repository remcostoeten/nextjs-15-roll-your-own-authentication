import { cookies } from 'next/headers'
import { AuthIndicatorClient } from './session-indicator'
import { SessionUser } from '../types'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function AuthIndicator() {
	const cookieStore = await cookies()
	const initialState = {
		isAuthenticated: false,
		user: undefined as SessionUser | undefined
	}

	const sessionId = cookieStore.get('session-id')?.value

	if (sessionId) {
		try {
			const user = await db.query.users.findFirst({
				where: eq(users.id, sessionId)
			})

			if (user) {
				initialState.isAuthenticated = true
				initialState.user = {
					userId: user.id,
					email: user.email,
					role: user.role ?? 'user'
				}
			}
		} catch {
			console.error('Failed to get auth state')
		}
	}

	return <AuthIndicatorClient initialState={initialState} />
}
