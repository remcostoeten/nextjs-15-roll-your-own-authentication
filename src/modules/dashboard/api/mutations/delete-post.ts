import { db } from '@/api/db'
import { posts } from '@/api/schema'
import { eq } from 'drizzle-orm'

export async function deletePost(id: number) {
  const [updated] = await db.update(posts)
    .set({ deletedAt: new Date() })
    .where(eq(posts.id, id))
    .returning()
  return !!updated
}

export async function restorePost(id: number) {
  const [updated] = await db.update(posts)
    .set({ deletedAt: null })
    .where(eq(posts.id, id))
    .returning()
  return !!updated
}

export async function hardDeletePost(id: number) {
  const deleted = await db.delete(posts).where(eq(posts.id, id)).returning()
  return deleted.length > 0
} 