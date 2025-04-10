'use server'

import { db } from '@/server/db'
import { chats, chatMembers } from '@/server/db/schema'
import { eq, and } from 'drizzle-orm'
import { getCurrentUser } from '@/modules/authentication/utilities/auth'

export async function getChat(chatId: string) {
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

		// Get chat details with creator info
		const chat = await db.query.chats.findFirst({
			where: eq(chats.id, chatId),
			with: {
				creator: true,
			},
		})

		if (!chat) {
			return { error: 'Chat not found' }
		}

		return { chat }
	} catch (error) {
		console.error('Error fetching chat:', error)
		return { error: 'Failed to fetch chat' }
	}
}
