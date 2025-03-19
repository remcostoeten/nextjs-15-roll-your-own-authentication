// Mock database for demo purposes
const mockVotes: Record<string, { ip: string; active: boolean }[]> = {}
const mockCooldowns: Record<string, Record<string, Date>> = {}

// Cooldown period in milliseconds (1 day)
const VOTE_COOLDOWN = 24 * 60 * 60 * 1000

/**
 * Vote for a changelog entry
 *
 * @param entryId The ID of the changelog entry
 * @param ipAddress The IP address of the voter
 * @param userAgent The user agent of the voter
 * @returns The result of the vote operation
 */
export async function voteChangelogEntry(
	entryId: string,
	ipAddress: string
): Promise<{
	success: boolean
	votes: number
	hasVoted: boolean
	message?: string
}> {
	try {
		// Check if the entry exists (in a real app, this would query the database)
		// For demo purposes, we'll assume all entries exist

		// Check if the user has already voted
		const existingVotes = mockVotes[entryId] || []
		const existingVote = existingVotes.find((v) => v.ip === ipAddress)
		const hasVoted = existingVote?.active || false

		// Check cooldown
		const now = Date.now()
		const cooldownRecord = mockCooldowns[entryId]?.[ipAddress]
		const lastVoted = cooldownRecord ? cooldownRecord.getTime() : 0
		const cooldownRemaining = lastVoted + VOTE_COOLDOWN - now

		// If user has already voted, unvote
		if (hasVoted) {
			// Update the vote to inactive
			if (existingVote) {
				existingVote.active = false
			}

			// Delete the cooldown record
			if (mockCooldowns[entryId]) {
				delete mockCooldowns[entryId][ipAddress]
			}

			// Get the updated vote count (mock implementation)
			const updatedVotes = (mockVotes[entryId] || []).filter(
				(v) => v.active
			).length

			return {
				success: true,
				votes: updatedVotes,
				hasVoted: false,
				message: 'Vote removed',
			}
		}
		// If user is in cooldown period, prevent voting
		else if (cooldownRemaining > 0) {
			const cooldownHours = Math.ceil(
				cooldownRemaining / (60 * 60 * 1000)
			)
			return {
				success: false,
				votes: (mockVotes[entryId] || []).filter((v) => v.active)
					.length,
				hasVoted: false,
				message: `You can vote again in ${cooldownHours} hours`,
			}
		}
		// Otherwise, add the vote
		else {
			// Insert the vote
			if (!mockVotes[entryId]) {
				mockVotes[entryId] = []
			}
			mockVotes[entryId].push({
				ip: ipAddress,
				active: true,
			})

			// Update or insert the cooldown record
			if (!mockCooldowns[entryId]) {
				mockCooldowns[entryId] = {}
			}
			mockCooldowns[entryId][ipAddress] = new Date()

			// Get the updated vote count
			const updatedVotes = mockVotes[entryId].filter(
				(v) => v.active
			).length

			return {
				success: true,
				votes: updatedVotes,
				hasVoted: true,
				message: 'Vote added',
			}
		}
	} catch (error) {
		console.error('Error processing vote:', error)
		return {
			success: false,
			votes: 0,
			hasVoted: false,
			message:
				error instanceof Error
					? error.message
					: 'Unknown error occurred',
		}
	}
}
