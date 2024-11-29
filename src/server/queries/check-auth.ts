'use server'

import { db } from '@/server/db'
import { sessions } from '@/server/db/schema'
import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'

/**
 * Check if user is authenticated by verifying session token
 * @author Remco Stoeten
 */
export async function checkAuthQuery() {
	try {
		const cookieStore = await cookies()
		const sessionToken = cookieStore.get('session')?.value

		if (!sessionToken) {
			return { authenticated: false }
		}

		const session = await db.query.sessions.findFirst({
			where: eq(sessions.token, sessionToken),
			with: {
				user: true
			}
		})

		if (!session || new Date(session.expiresAt) < new Date()) {
			return { authenticated: false }
		}

		return {
			authenticated: true,
			user: session.user
		}
	} catch (error) {
		console.error('Auth check error:', error)
		return { authenticated: false }
	}
}
