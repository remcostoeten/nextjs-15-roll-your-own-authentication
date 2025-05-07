import { db } from '@/api/db'
import { posts } from '@/api/schema'
import { postSchema } from '@/modules/dashboard/models/z.post'
import { z } from 'zod'

const createPostInput = z.object({
  title: z.string().max(255),
  content: z.any(),
  authorId: z.number()
})

export async function createPost(input: z.infer<typeof createPostInput>) {
  const data = createPostInput.parse(input)
  const [created] = await db.insert(posts).values({
    title: data.title,
    content: data.content,
    authorId: data.authorId
  }).returning()
  return postSchema.parse(created)
} 