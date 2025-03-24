'use server'

import { db } from '@/server/db'
import { posts } from '@/server/db/schemas/posts'
import { logUserActivity } from '@/shared/utils/activity-logger'
import { postSchema, type PostInput, type PostRequestContext } from '@/modules/posts/models/z.post'

export async function createPost(data: PostInput, ctx: PostRequestContext) {
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
				sensitive: validatedData.sensitive,
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
