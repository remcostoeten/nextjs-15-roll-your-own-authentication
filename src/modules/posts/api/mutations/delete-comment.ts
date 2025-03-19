"use server"

import { db } from '@/server/db'
import { comments } from '@/server/db/schemas/comments'
import { eq } from 'drizzle-orm'
import { logUserActivity } from '@/shared/utils/activity-logger'
import { type PostRequestContext } from '@/modules/posts/models/z.post'

export async function deleteComment(commentId: string, ctx: PostRequestContext) {
    try {
        // Check if the comment exists
        const comment = await db.query.comments.findFirst({
            where: eq(comments.id, commentId),
        })

        if (!comment) {
            throw new Error("Comment not found")
        }

        // Check if the user has permission to delete this comment
        if (comment.authorId !== ctx.userId) {
            // Log unauthorized attempt
            await logUserActivity({
                userId: ctx.userId,
                type: 'system_error',
                entity: 'comment',
                entityId: commentId,
                ip: ctx.ipAddress,
                userAgent: ctx.userAgent,
                details: 'Unauthorized attempt to delete comment',
            })

            throw new Error("You don't have permission to delete this comment")
        }

        // Get any child comments/replies
        const childComments = await db.query.comments.findMany({
            where: eq(comments.parentId, commentId),
        })

        // Delete the comment and its replies
        if (childComments.length > 0) {
            // First delete all child comments
            for (const child of childComments) {
                await db.delete(comments).where(eq(comments.id, child.id))

                // Log each child deletion
                await logUserActivity({
                    userId: ctx.userId,
                    type: 'delete',
                    entity: 'comment',
                    entityId: child.id,
                    ip: ctx.ipAddress,
                    userAgent: ctx.userAgent,
                    metadata: {
                        postId: comment.postId,
                        isReply: true,
                    },
                })
            }
        }

        // Now delete the main comment
        await db.delete(comments).where(eq(comments.id, commentId))

        // Log the comment deletion
        await logUserActivity({
            userId: ctx.userId,
            type: 'delete',
            entity: 'comment',
            entityId: commentId,
            ip: ctx.ipAddress,
            userAgent: ctx.userAgent,
            metadata: {
                postId: comment.postId,
                isReply: !!comment.parentId,
                repliesDeleted: childComments.length,
            },
        })

        return { success: true, deleted: { comment, childrenCount: childComments.length } }
    } catch (error) {
        console.error("Error deleting comment:", error)
        throw error
    }
} 