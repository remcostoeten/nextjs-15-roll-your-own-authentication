import { db } from '@/api/db'
import { posts } from '@/api/schema'
import { postSchema } from '@/modules/dashboard/models/z.post'
import { z } from 'zod'
import { eq } from 'drizzle-orm'

const updatePostInput = z.object({
  id: z.number(),
  title: z.string().max(255).optional(),
  content: z.any().optional(),
  visibility: z.enum(['private', 'public']).optional(),
  shareId: z.string().max(32).optional()
})

export async function updatePost(input: z.infer<typeof updatePostInput>) {
  const data = updatePostInput.parse(input)
  const [updated] = await db.update(posts)
    .set({
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.content !== undefined ? { content: data.content } : {}),
      ...(data.visibility !== undefined ? { visibility: data.visibility } : {}),
      ...(data.shareId !== undefined ? { shareId: data.shareId } : {})
    })
    .where(eq(posts.id, data.id))
    .returning()
  if (!updated) throw new Error('Post not found')
  return postSchema.parse(updated)
} 