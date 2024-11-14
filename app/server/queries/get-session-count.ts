'use server'

import { sessions } from '@/features/authentication'
import { db } from 'db'
import { count, eq } from 'drizzle-orm'

export async function getSessionCount(userId?: number) {
	if (!userId) return 0

	try {
		const [result] = await db
			.select({ count: count() })
			.from(sessions)
			.where(eq(sessions.userId, userId))

		return result.count
	} catch (error) {
		console.error('Failed to get session count:', error)
		return 0
	}
}
