'use server'

import { db } from '@/server/db'
import { messages, chatMembers, favorites } from '@/server/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { getCurrentUser } from '@/modules/authentication/utilities/auth'

export async function getChatMessages(chatId: string, limit = 50) {
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

		// Get messages with user info
		const chatMessages = await db.query.messages.findMany({
			where: eq(messages.chat_id, chatId),
			orderBy: [desc(messages.timestamp)],
			limit,
			with: {
				user: true,
				favorites: {
					where: eq(favorites.user_id, user.id),
				},
			},
		})

		// Mark messages as favorite if user has favorited them
		const messagesWithFavorites = chatMessages.map((message) => ({
			...message,
			is_favorite: message.favorites.length > 0,
			favorites: undefined, // Remove the favorites array from the response
		}))

		return { messages: messagesWithFavorites }
	} catch (error) {
		console.error('Error fetching chat messages:', error)
		return { error: 'Failed to fetch chat messages' }
	}
}
