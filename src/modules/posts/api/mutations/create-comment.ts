'use server'

import { db } from '@/server/db'
import { comments } from '@/server/db/schemas/comments'
import { posts } from '@/server/db/schemas/posts'
import { eq } from 'drizzle-orm'
import { createId } from '@paralleldrive/cuid2'
import { logUserActivity } from '@/shared/utils/activity-logger'
import { z } from 'zod'
import { type PostRequestContext } from '@/modules/posts/models/z.post'

// Define the comment schema
const commentSchema = z.object({
	content: z
		.string()
		.min(1, 'Comment cannot be empty')
		.max(1000, 'Comment is too long'),
	postId: z.string().min(1),
	parentId: z.string().optional(),
})

export type CommentInput = z.infer<typeof commentSchema>

export async function createComment(
	data: CommentInput,
	ctx: PostRequestContext
) {
	try {
		// Validate comment data
		const validatedData = commentSchema.parse(data)

		// Check if the post exists
		const post = await db.query.posts.findFirst({
			where: eq(posts.id, validatedData.postId),
		})

		if (!post) {
			throw new Error('Post not found')
		}

		// If this is a reply, check if the parent comment exists
		if (validatedData.parentId) {
			const parentComment = await db.query.comments.findFirst({
				where: eq(comments.id, validatedData.parentId),
			})

			if (!parentComment) {
				throw new Error('Parent comment not found')
			}

			// Make sure the parent comment belongs to the same post
			if (parentComment.postId !== validatedData.postId) {
				throw new Error('Parent comment does not belong to this post')
			}
		}

		// Create the comment
		const now = new Date()
		const [newComment] = await db
			.insert(comments)
			.values({
				id: createId(),
				content: validatedData.content,
				postId: validatedData.postId,
				authorId: ctx.userId,
				parentId: validatedData.parentId || null,
				createdAt: now,
				updatedAt: now,
			})
			.returning()

		if (!newComment) {
			throw new Error('Failed to create comment')
		}

		// Log the comment creation
		await logUserActivity({
			userId: ctx.userId,
			type: 'create',
			entity: 'comment',
			entityId: newComment.id,
			ip: ctx.ipAddress,
			userAgent: ctx.userAgent,
			metadata: {
				postId: validatedData.postId,
				isReply: !!validatedData.parentId,
			},
		})

		// Get the comment with author information
		const commentWithAuthor = await db.query.comments.findFirst({
			where: eq(comments.id, newComment.id),
			with: {
				author: {
					columns: {
						id: true,
						firstName: true,
						lastName: true,
						avatar: true,
					},
				},
			},
		})

		return commentWithAuthor
	} catch (error) {
		console.error('Error creating comment:', error)
		throw error
	}
}
