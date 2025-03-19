import { cookies } from 'next/headers'
import { db } from '@/server/db'
import { users } from '@/server/db/schemas'
import { eq } from 'drizzle-orm'
import { verifyToken } from './utils/jwt'

export type AuthSession = {
	user: {
		id: string
		email: string
		role: 'admin' | 'user'
	}
}

export async function auth(): Promise<AuthSession | null> {
	try {
		const cookieStore = await cookies()
		const accessToken = cookieStore.get('access_token')

		if (!accessToken?.value) {
			return null
		}

		const payload = await verifyToken(accessToken.value)
		if (!payload?.sub) {
			return null
		}

		const user = await db.query.users.findFirst({
			where: eq(users.id, payload.sub),
			columns: {
				id: true,
				email: true,
				role: true,
			},
		})

		if (!user) {
			return null
		}

		return {
			user: {
				id: user.id,
				email: user.email,
				role: user.role,
			},
		}
	} catch (error) {
		console.error('Auth error:', error)
		return null
	}
}
