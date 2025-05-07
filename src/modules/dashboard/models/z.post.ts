import { z } from 'zod'

export const postSchema = z.object({
  id: z.number(),
  title: z.string().max(255),
  content: z.any(), // JSON for Notion-like blocks
  createdAt: z.date(),
  updatedAt: z.date(),
  authorId: z.number()
})

export type Post = z.infer<typeof postSchema> 