'use server'

import { sessions } from '@/features/authentication/sessions/schema'
import { db } from 'db'
import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'

export async function getSession() {
	const token = (await cookies()).get('auth_token')?.value
	if (!token) return null

	try {
		const session = await db
			.select()
			.from(sessions)
			.where(eq(sessions.token, token))
			.limit(1)

		if (session.length === 0) return null

		// Update last active timestamp
		await db
			.update(sessions)
			.set({
				lastActive: new Date(),
				updatedAt: new Date()
			})
			.where(eq(sessions.token, token))

		return session[0]
	} catch (error) {
		console.error('Session query error:', error)
		return null
	}
}
