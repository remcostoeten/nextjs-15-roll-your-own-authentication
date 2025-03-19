'use server'

import { db } from '@/server/db'
import { posts } from '@/server/db/schemas/posts'
import { eq } from 'drizzle-orm'
import { logUserActivity } from '@/shared/utils/activity-logger'
import { type PostRequestContext } from '@/modules/posts/models/z.post'

export async function deletePost(postId: string, ctx: PostRequestContext) {
	try {
		// Retrieve the post to check ownership
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
				details: 'Unauthorized attempt to delete post',
			})

			throw new Error('Unauthorized: You can only delete your own posts')
		}

		// Delete post
		await db.delete(posts).where(eq(posts.id, postId))

		// Log post deletion activity
		await logUserActivity({
			userId: ctx.userId,
			type: 'delete',
			entity: 'post',
			entityId: postId,
			ip: ctx.ipAddress,
			userAgent: ctx.userAgent,
			metadata: {
				title: existingPost.title,
				wasPublished: existingPost.published,
			},
		})

		return { success: true, deletedId: postId }
	} catch (error) {
		console.error('Error deleting post:', error)
		throw error
	}
}
