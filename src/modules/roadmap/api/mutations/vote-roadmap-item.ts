'use server'

import { db, roadmapItems } from '@/server/db'
import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { voteSchema } from '../models/z.votes'
import { generateFingerprint, getIpAddress } from '@/shared/utils/user-fingerprint'

export type VoteResult = {
	success: boolean
	message: string
	newVoteCount?: number
}

const VOTE_EXPIRY = 60 * 60 * 24 * 7 // 1 week in seconds

/**
 * Vote on a roadmap item with enhanced security
 */
export async function voteRoadmapItem(data: unknown): Promise<VoteResult> {
	try {
		const { roadmapId, operation } = voteSchema.parse(data)

		// Get user identifiers
		const fingerprint = await generateFingerprint()
		const ipAddress = await getIpAddress()
		
		// Create a composite key for vote tracking
		const voteKey = `vote:${roadmapId}:${fingerprint}:${ipAddress}`
		
		// Get cookies instance
		const cookieStore = await cookies()
		const votedItemsCookie = cookieStore.get('roadmap_votes')
		const votedItems: Record<string, { timestamp: number }> = votedItemsCookie?.value
			? JSON.parse(votedItemsCookie.value)
			: {}

		const item = await db.query.roadmapItems.findFirst({
			where: eq(roadmapItems.id, roadmapId),
		})

		if (!item) {
			return {
				success: false,
				message: 'Roadmap item not found',
			}
		}

		const now = Math.floor(Date.now() / 1000)
		const lastVote = votedItems[voteKey]?.timestamp || 0
		
		// Check if the vote has expired
		const hasVoteExpired = now - lastVote > VOTE_EXPIRY

		let voteChange = 0

		if (operation === 'upvote' && (!votedItems[voteKey] || hasVoteExpired)) {
			voteChange = 1
			votedItems[voteKey] = { timestamp: now }
		} else if (operation === 'downvote' && (!votedItems[voteKey] || hasVoteExpired)) {
			voteChange = -1
			votedItems[voteKey] = { timestamp: now }
		} else if (operation === 'remove' && votedItems[voteKey] && !hasVoteExpired) {
			voteChange = -1
			delete votedItems[voteKey]
		} else {
			return {
				success: false,
				message: hasVoteExpired 
					? 'Your previous vote has expired. You can vote again.'
					: 'You have already voted on this item',
			}
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

		// Set cookie with strict security options
		await cookieStore.set('roadmap_votes', JSON.stringify(votedItems), {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: VOTE_EXPIRY,
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
