'use server'

import { db } from '@/server/db'
import { chatMembers } from '@/server/db/schema'
import { eq, and } from 'drizzle-orm'
import { getCurrentUser } from '@/modules/authentication/utilities/auth'

export async function getChatMembers(chatId: string) {
	const user = await getCurrentUser()

	if (!user) {
		return { error: 'You must be logged in' }
	}

	try {
		// Check if user is a member of the chat
		const membership = await db.query.chatMembers.findFirst({
			where: and(
				eq(chatMembers.chatId, chatId),
				eq(chatMembers.userId, user.id)
			),
		})

		if (!membership) {
			return { error: 'You do not have access to this chat' }
		}

		// Get all members of the chat
		const members = await db.query.chatMembers.findMany({
			where: eq(chatMembers.chatId, chatId),
			with: {
				user: true,
			},
			orderBy: (chatMembers, { asc }) => [asc(chatMembers.joinedAt)],
		})

		return { members }
	} catch (error) {
		console.error('Error fetching chat members:', error)
		return { error: 'Failed to fetch chat members' }
	}
}
