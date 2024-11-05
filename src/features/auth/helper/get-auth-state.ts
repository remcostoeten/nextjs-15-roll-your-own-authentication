'use server'

import { getSession } from '../session'

export async function getAuthState() {
	const session = await getSession()

	if (!session) {
		return { isAuthenticated: false }
	}

	return {
		isAuthenticated: true,
		user: {
			userId: session.userId,
			email: session.email,
			role: session.role ?? 'user'
		}
	}
}
