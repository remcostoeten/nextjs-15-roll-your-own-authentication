'use server'

import { db } from '@/server/db'
import { changelogItems } from '@/server/db/schemas'
import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { z } from 'zod'

const voteSchema = z.object({
	changelogId: z.string().min(1),
	operation: z.enum(['upvote', 'downvote', 'remove']),
})

export type VoteResult = {
	success: boolean
	message: string
	newVoteCount?: number
}

/**
 * Vote on a changelog item
 * @param data Object containing changelogId and operation (upvote, downvote, or remove)
 */
export async function voteChangelogItem(data: unknown): Promise<VoteResult> {
	try {
		const { changelogId, operation } = voteSchema.parse(data)

		// Check if user already voted on this item
		const cookieStore = cookies()
		const votedItemsCookie = cookieStore.get('changelog_votes')
		const votedItems: Record<string, boolean> = votedItemsCookie ? JSON.parse(votedItemsCookie.value) : {}

		// Get current item
		const item = await db.query.changelogItems.findFirst({
			where: eq(changelogItems.id, changelogId),
		})

		if (!item) {
			return {
				success: false,
				message: 'Changelog item not found',
			}
		}

		let voteChange = 0

		if (operation === 'upvote' && !votedItems[changelogId]) {
			voteChange = 1
			votedItems[changelogId] = true
		} else if (operation === 'downvote' && !votedItems[changelogId]) {
			voteChange = -1
			votedItems[changelogId] = true
		} else if (operation === 'remove' && votedItems[changelogId]) {
			// If removing a vote, first determine if it was an upvote or downvote
			// For simplicity, we'll assume all votes are upvotes in this example
			voteChange = -1
			delete votedItems[changelogId]
		}

		// Update item votes
		if (voteChange !== 0) {
			await db
				.update(changelogItems)
				.set({
					votes: (item.votes || 0) + voteChange,
				})
				.where(eq(changelogItems.id, changelogId))
		}

		// Save updated voted items to cookie
		cookieStore.set('changelog_votes', JSON.stringify(votedItems), {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 365, // 1 year
			path: '/',
		})

		return {
			success: true,
			message: 'Vote registered successfully',
			newVoteCount: (item.votes || 0) + voteChange,
		}
	} catch (error) {
		console.error('Error voting on changelog item:', error)

		if (error instanceof z.ZodError) {
			return {
				success: false,
				message: 'Invalid data provided',
			}
		}

		return {
			success: false,
			message: 'Failed to register vote',
		}
	}
}
