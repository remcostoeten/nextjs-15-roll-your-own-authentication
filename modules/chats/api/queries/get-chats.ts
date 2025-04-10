'use server'

import { db } from '@/server/db'
import { chatMembers } from '@/server/db/schema'
import { eq } from 'drizzle-orm'
import { getCurrentUser } from '@/modules/authentication/utilities/auth'

export async function getChats() {
	const user = await getCurrentUser()

	if (!user) {
		return { error: 'You must be logged in' }
	}

	try {
		const userChats = await db.query.chatMembers.findMany({
			where: eq(chatMembers.userId, user.id),
			with: {
				chat: {
					with: {
						creator: true,
					},
				},
			},
			orderBy: (chatMembers, { desc }) => [desc(chatMembers.joinedAt)],
		})

		const chats = userChats.map((membership) => membership.chat)

		return { chats }
	} catch (error) {
		console.error('Error fetching chats:', error)
		return { error: 'Failed to fetch chats' }
	}
}
