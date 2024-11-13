import { db } from 'db'
import { eq } from 'drizzle-orm'
import { users } from '../users/schema'

export async function resetLoginAttempts(userId: number) {
	await db
		.update(users)
		.set({
			loginAttempts: 0,
			lastLoginAttempt: new Date()
		})
		.where(eq(users.id, userId))
}
