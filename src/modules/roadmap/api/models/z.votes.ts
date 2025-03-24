import { z } from 'zod'

export const voteSchema = z.object({
	roadmapId: z.string().min(1),
	operation: z.enum(['upvote', 'downvote', 'remove']),
})
