'use server'

import { db } from '@/server/db'
import { comments } from '@/server/db/schemas/comments'
import { eq, and, isNull } from 'drizzle-orm'
import { type PostRequestContext } from '@/modules/posts/models/z.post'

export interface GetCommentsOptions {
	postId: string
	includeReplies?: boolean
}

export async function getComments(
	options: GetCommentsOptions,
	ctx?: PostRequestContext
) {
	try {
		const { postId, includeReplies = true } = options

		// Get top-level comments (comments without a parent)
		const topLevelComments = await db.query.comments.findMany({
			where: and(eq(comments.postId, postId), isNull(comments.parentId)),
			orderBy: (comments, { desc }) => [desc(comments.createdAt)],
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

		// If replies are not needed, return just the top-level comments
		if (!includeReplies) {
			return topLevelComments
		}

		// Get all comments including replies with parent information
		const allComments = await db.query.comments.findMany({
			where: eq(comments.postId, postId),
			orderBy: (comments, { desc }) => [desc(comments.createdAt)],
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

		// Create a map of parent comment IDs to their replies
		const commentTree = topLevelComments.map((comment) => {
			return {
				...comment,
				replies: allComments
					.filter((reply) => reply.parentId === comment.id)
					.sort(
						(a, b) =>
							new Date(b.createdAt).getTime() -
							new Date(a.createdAt).getTime()
					),
			}
		})

		return commentTree
	} catch (error) {
		console.error('Error retrieving comments:', error)
		throw error
	}
}
