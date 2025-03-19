import { z } from 'zod'

export const postSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
    content: z.string().min(1, "Content is required"),
    published: z.boolean().default(false),
    sensitive: z.boolean().default(false),
})

export type Post = z.infer<typeof postSchema>

// Input type for creating a post
export type PostInput = z.infer<typeof postSchema>

// Input type for updating a post (all fields optional)
export type PostUpdateInput = z.infer<typeof postSchema.partial() >

// Request context for post operations
export interface PostRequestContext {
    userId: string
    userAgent?: string
    ipAddress?: string
} 