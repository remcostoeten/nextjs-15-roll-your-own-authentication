"use server"

import { db } from '@/server/db'
import { posts } from '@/server/db/schemas/posts'
import { eq } from 'drizzle-orm'
import { logUserActivity } from '@/shared/utils/activity-logger'
import { type PostRequestContext } from '@/modules/posts/models/z.post'

export async function getPost(postId: string, ctx: PostRequestContext) {
    try {
        const post = await db.query.posts.findFirst({
            where: eq(posts.id, postId),
            with: {
                author: {
                    columns: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    }
                }
            }
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