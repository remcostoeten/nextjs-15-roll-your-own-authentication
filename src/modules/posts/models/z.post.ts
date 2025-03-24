import { z } from 'zod'

// Post input schema - for creating/updating posts
export const postSchema = z.object({
	title: z
		.string()
		.min(3, { message: 'Title must be at least 3 characters long' })
		.max(200, { message: 'Title must be at most 200 characters long' }),
	content: z.string().min(10, { message: 'Content must be at least 10 characters long' }).max(10000, {
		message: 'Content must be at most 10000 characters long',
	}),
	published: z.boolean().default(true),
	sensitive: z.boolean().default(false),
})

// Post schema with database fields
export const postDbSchema = postSchema.extend({
	id: z.string(),
	authorId: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

// Types
export type PostInput = z.infer<typeof postSchema>
export type Post = z.infer<typeof postDbSchema>

// Post with author schema - updated to match our database schema
export const postWithAuthorSchema = postDbSchema.extend({
	author: z.object({
		id: z.string(),
		firstName: z.string().nullable(),
		lastName: z.string().nullable(),
	}),
})

export type PostWithAuthor = z.infer<typeof postWithAuthorSchema>

// Request context for post operations
export interface PostRequestContext {
	userId: string
	userAgent?: string
	ipAddress?: string
}
