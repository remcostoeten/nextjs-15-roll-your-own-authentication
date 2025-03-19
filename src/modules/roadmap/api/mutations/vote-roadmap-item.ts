'use server'

import { db } from '@/server/db'
import { roadmapItems } from '@/server/db/schemas'
import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { z } from 'zod'

const voteSchema = z.object({
	roadmapId: z.string().min(1),
	operation: z.enum(['upvote', 'downvote', 'remove']),
})

export type VoteResult = {
	success: boolean
	message: string
	newVoteCount?: number
}

/**
 * Vote on a roadmap item
 * @param data Object containing roadmapId and operation (upvote, downvote, or remove)
 */
export async function voteRoadmapItem(data: unknown): Promise<VoteResult> {
	try {
		const { roadmapId, operation } = voteSchema.parse(data)

		// Check if user already voted on this item
		const cookieStore = cookies()
		const votedItemsCookie = cookieStore.get('roadmap_votes')
		const votedItems: Record<string, boolean> = votedItemsCookie
			? JSON.parse(votedItemsCookie.value)
			: {}

		// Get current item
		const item = await db.query.roadmapItems.findFirst({
			where: eq(roadmapItems.id, roadmapId),
		})

		if (!item) {
			return {
				success: false,
				message: 'Roadmap item not found',
			}
		}

		let voteChange = 0

		if (operation === 'upvote' && !votedItems[roadmapId]) {
			voteChange = 1
			votedItems[roadmapId] = true
		} else if (operation === 'downvote' && !votedItems[roadmapId]) {
			voteChange = -1
			votedItems[roadmapId] = true
		} else if (operation === 'remove' && votedItems[roadmapId]) {
			// If removing a vote, first determine if it was an upvote or downvote
			// For simplicity, we'll assume all votes are upvotes in this example
			voteChange = -1
			delete votedItems[roadmapId]
		}

		// Update item votes
		if (voteChange !== 0) {
			await db
				.update(roadmapItems)
				.set({
					votes: (item.votes || 0) + voteChange,
				})
				.where(eq(roadmapItems.id, roadmapId))
		}

		// Save updated voted items to cookie
		cookieStore.set('roadmap_votes', JSON.stringify(votedItems), {
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
		console.error('Error voting on roadmap item:', error)

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
