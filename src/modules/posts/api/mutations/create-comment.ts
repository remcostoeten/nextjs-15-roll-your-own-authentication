'use server'

import { db } from '@/server/db'
import { comments } from '@/server/db/schemas/comments'
import { posts } from '@/server/db/schemas/posts'
import { eq } from 'drizzle-orm'
import { createId } from '@paralleldrive/cuid2'
import { logUserActivity } from '@/shared/utils/activity-logger'
import { z } from 'zod'
import { type PostRequestContext } from '@/modules/posts/models/z.post'

export async function createComment(
	data: CommentInput,
	ctx: PostRequestContext
) {
	try {
		const validatedData = commentSchema.parse(data)

		const post = await db.query.posts.findFirst({
			where: eq(posts.id, validatedData.postId),
		})

		if (!post) {
			throw new Error('Post not found')
		}

		if (validatedData.parentId) {
			const parentComment = await db.query.comments.findFirst({
				where: eq(comments.id, validatedData.parentId),
			})

			if (!parentComment) {
				throw new Error('Parent comment not found')
			}

			if (parentComment.postId !== validatedData.postId) {
				throw new Error('Parent comment does not belong to this post')
			}
		}

		const now = Date.now()
		const commentId = createId()

		await db.insert(comments).values({
			id: commentId,
			content: validatedData.content,
			postId: validatedData.postId,
			authorId: ctx.userId,
			parentId: validatedData.parentId || null,
			createdAt: now,
			updatedAt: now,
		})

		const commentWithAuthor = await db.query.comments.findFirst({
			where: eq(comments.id, commentId),
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

		await logUserActivity({
			userId: ctx.userId,
			type: 'create',
			entity: 'comment',
			entityId: commentId,
			ip: ctx.ipAddress,
			userAgent: ctx.userAgent,
			metadata: {
				postId: validatedData.postId,
				isReply: !!validatedData.parentId,
			},
		})

		return commentWithAuthor
	} catch (error) {
		console.error('Error creating comment:', error)
		throw error
	}
}
