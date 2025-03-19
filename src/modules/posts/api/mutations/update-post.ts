'use server'

import { db } from '@/server/db'
import { posts } from '@/server/db/schemas/posts'
import { eq } from 'drizzle-orm'
import { logUserActivity } from '@/shared/utils/activity-logger'
import {
	postSchema,
	type PostRequestContext,
} from '@/modules/posts/models/z.post'

export async function updatePost(
	postId: string,
	data: Partial<{
		title?: string
		content?: string
		published?: boolean
		sensitive?: boolean
	}>,
	ctx: PostRequestContext
) {
	try {
		// Validate post data with partial schema
		const validatedData = postSchema.partial().parse(data)

		// Retrieve the post to check ownership and log changes
		const existingPost = await db.query.posts.findFirst({
			where: eq(posts.id, postId),
		})

		if (!existingPost) {
			throw new Error('Post not found')
		}

		// Check if user owns the post
		if (existingPost.authorId !== ctx.userId) {
			// Log unauthorized attempt
			await logUserActivity({
				userId: ctx.userId,
				type: 'system_error',
				entity: 'post',
				entityId: postId,
				ip: ctx.ipAddress,
				userAgent: ctx.userAgent,
				details: 'Unauthorized attempt to update post',
			})

			throw new Error('Unauthorized: You can only update your own posts')
		}

		// Update post
		const [updatedPost] = await db
			.update(posts)
			.set({
				...validatedData,
				updatedAt: new Date(),
			})
			.where(eq(posts.id, postId))
			.returning()

		if (!updatedPost) {
			throw new Error('Failed to update post')
		}

		// Log post update activity
		await logUserActivity({
			userId: ctx.userId,
			type: 'update',
			entity: 'post',
			entityId: postId,
			ip: ctx.ipAddress,
			userAgent: ctx.userAgent,
			metadata: {
				updatedFields: Object.keys(validatedData),
				publishStatusChanged:
					validatedData.published !== undefined &&
					validatedData.published !== existingPost.published,
			},
		})

		return updatedPost
	} catch (error) {
		console.error('Error updating post:', error)
		throw error
	}
}
