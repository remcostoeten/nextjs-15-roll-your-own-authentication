// src/features/auth/helper/get-auth-state.ts
'use server'

import { cookies } from 'next/headers'
import { SessionUser } from '../types'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

type AuthStateResponse = {
	isAuthenticated: boolean
	user?: SessionUser
}

export async function getAuthState(): Promise<AuthStateResponse> {
	const cookieStore = await cookies()
	const sessionId = cookieStore.get('session-id')?.value

	if (!sessionId) {
		return { isAuthenticated: false }
	}

	try {
		const user = await db.query.users.findFirst({
			where: eq(users.id, sessionId)
		})

		if (!user) {
			return { isAuthenticated: false }
		}

		const sessionUser: SessionUser = {
			userId: user.id,
			email: user.email,
			role: user.role ?? 'user'
		}

		return {
			isAuthenticated: true,
			user: sessionUser
		}
	} catch {
		return { isAuthenticated: false }
	}
}
