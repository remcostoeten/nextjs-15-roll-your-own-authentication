import { eq } from 'drizzle-orm'
import { db } from '../server/db'
import { users } from '../server/db/schema'

export async function updateUserAvatar(userId: number, avatarUrl: string) {
	const [updatedUser] = await db
		.update(users)
		.set({ avatar: avatarUrl })
		.where(eq(users.id, userId))
		.returning()

	return updatedUser
}
