/**
 * Post Service
 *
 * Example service that handles CRUD operations for posts with activity logging
 */

import { db } from '@/server/db'
import { posts } from '@/server/db/schemas/posts'
import { eq } from 'drizzle-orm'
import { logUserActivity } from '@/shared/utils/activity-logger'
import { z } from 'zod'

// Define post schema for validation
const postSchema = z.object({
	title: z.string().min(1).max(100),
	content: z.string().min(1),
	published: z.boolean().default(false),
})

type PostInput = z.infer<typeof postSchema>

export interface RequestContext {
	userId: string
	userAgent?: string
	ipAddress?: string
}

/**
 * Create a new post with activity logging
 */
export async function createPost(data: PostInput, ctx: RequestContext) {
	try {
		// Validate post data
		const validatedData = postSchema.parse(data)

		// Insert post into database
		const [newPost] = await db
			.insert(posts)
			.values({
				title: validatedData.title,
				content: validatedData.content,
				published: validatedData.published,
				authorId: ctx.userId,
			})
			.returning()

		if (!newPost) {
			throw new Error('Failed to create post')
		}

		// Log post creation activity
		await logUserActivity({
			userId: ctx.userId,
			type: 'create',
			entity: 'post',
			entityId: newPost.id,
			ip: ctx.ipAddress,
			userAgent: ctx.userAgent,
			metadata: {
				title: newPost.title,
				published: newPost.published,
			},
		})

		return newPost
	} catch (error) {
		console.error('Error creating post:', error)
		throw error
	}
}

/**
 * Update an existing post with activity logging
 */
export async function updatePost(
	postId: string,
	data: Partial<PostInput>,
	ctx: RequestContext
) {
	try {
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
				...data,
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
				updatedFields: Object.keys(data),
				publishStatusChanged:
					data.published !== undefined &&
					data.published !== existingPost.published,
			},
		})

		return updatedPost
	} catch (error) {
		console.error('Error updating post:', error)
		throw error
	}
}

/**
 * Delete a post with activity logging
 */
export async function deletePost(postId: string, ctx: RequestContext) {
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

/**
 * Get a post with activity logging for sensitive posts
 */
export async function getPost(postId: string, ctx: RequestContext) {
	try {
		const post = await db.query.posts.findFirst({
			where: eq(posts.id, postId),
		})

		if (!post) {
			throw new Error('Post not found')
		}

		// If the post is not published and user is not the author, log access attempt
		if (!post.published && post.authorId !== ctx.userId) {
			await logUserActivity({
				userId: ctx.userId,
				type: 'system_error',
				entity: 'post',
				entityId: postId,
				ip: ctx.ipAddress,
				userAgent: ctx.userAgent,
				details: 'Unauthorized attempt to access unpublished post',
			})

			throw new Error('Unauthorized: This post is not published')
		}

		// Only log reads for specific types of sensitive content
		// Typically you wouldn't log every read for performance reasons
		if (post.sensitive) {
			await logUserActivity({
				userId: ctx.userId,
				type: 'read',
				entity: 'post',
				entityId: postId,
				ip: ctx.ipAddress,
				userAgent: ctx.userAgent,
			})
		}

		return post
	} catch (error) {
		console.error('Error retrieving post:', error)
		throw error
	}
}
