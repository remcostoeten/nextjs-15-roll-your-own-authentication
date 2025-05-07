import { db } from '@/api/db'
import { posts } from '@/api/schema'
import { eq } from 'drizzle-orm'
import { postSchema } from '@/modules/dashboard/models/z.post'

export async function getPost(id: number) {
  const [post] = await db.select().from(posts).where(eq(posts.id, id))
  if (!post) throw new Error('Post not found')
  return postSchema.parse(post)
}

export async function getPostByShareId(shareId: string) {
  const [post] = await db.select().from(posts).where(eq(posts.shareId, shareId))
  if (!post) throw new Error('Post not found')
  return postSchema.parse(post)
} 