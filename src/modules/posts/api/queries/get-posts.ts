'use server'

import { db } from '@/server/db'
import { posts } from '@/server/db/schemas/posts'
import { desc, eq, or, and } from 'drizzle-orm'
import { type PostRequestContext } from '@/modules/posts/models/z.post'

export interface GetPostsOptions {
	page?: number
	limit?: number
	includeDrafts?: boolean
}

export async function getPosts(options: GetPostsOptions = {}, ctx: PostRequestContext) {
	try {
		const { page = 1, limit = 10, includeDrafts = false } = options

		const offset = (page - 1) * limit

		// Build conditions
		const conditions = []

		// Only show published posts unless drafts are specifically requested
		if (!includeDrafts) {
			conditions.push(eq(posts.published, true))
		} else if (includeDrafts && ctx.userId) {
			// If drafts are included, only show the user's own drafts
			conditions.push(
				or(eq(posts.published, true), and(eq(posts.authorId, ctx.userId), eq(posts.published, false)))
			)
		}

		// Execute the query with pagination
		const postsList = await db.query.posts.findMany({
			where: conditions.length ? conditions[0] : undefined,
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
			where: conditions.length ? conditions[0] : undefined,
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
		console.error('Error retrieving posts:', error)
		throw error
	}
}
