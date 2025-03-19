'use server'

import { db } from '@/server/db'
import { posts } from '@/server/db/schemas/posts'
import { desc, eq, and } from 'drizzle-orm'
import { type PostRequestContext } from '@/modules/posts/models/z.post'

export interface GetUserPostsOptions {
	userId: string
	page?: number
	limit?: number
	onlyPublished?: boolean
}

export async function getUserPosts(
	options: GetUserPostsOptions,
	ctx: PostRequestContext
) {
	try {
		const { userId, page = 1, limit = 10, onlyPublished = true } = options

		const offset = (page - 1) * limit

		// Build conditions
		const conditions = [eq(posts.authorId, userId)]

		// Only include published posts unless the requester is the author
		if (onlyPublished && userId !== ctx.userId) {
			conditions.push(eq(posts.published, true))
		}

		// Execute the query with pagination
		const postsList = await db.query.posts.findMany({
			where: and(...conditions),
			orderBy: [desc(posts.createdAt)],
			limit,
			offset,
			with: {
				author: {
					columns: {
						id: true,
						firstName: true,
						lastName: true,
					},
				},
			},
		})

		// Get total count for pagination
		const totalPosts = await db.query.posts.findMany({
			where: and(...conditions),
			columns: {
				id: true,
			},
		})

		return {
			posts: postsList,
			pagination: {
				total: totalPosts.length,
				page,
				limit,
				totalPages: Math.ceil(totalPosts.length / limit),
			},
		}
	} catch (error) {
		console.error('Error retrieving user posts:', error)
		throw error
	}
}
