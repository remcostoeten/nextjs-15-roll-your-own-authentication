import { z } from 'zod'

const commentSchema = z.object({
	content: z
		.string()
		.min(1, 'Comment cannot be empty')
		.max(1000, 'Comment is too long'),
	postId: z.string().min(1),
	parentId: z.string().optional(),
})

export type CommentInput = z.infer<typeof commentSchema>
