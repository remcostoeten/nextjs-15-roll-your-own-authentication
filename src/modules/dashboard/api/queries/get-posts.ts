import { db } from '@/api/db'
import { posts } from '@/api/schema'
import { desc, isNull, isNotNull } from 'drizzle-orm'
import { postSchema } from '@/modules/dashboard/models/z.post'

export async function getPosts() {
  const result = await db.select().from(posts)
    .where(isNull(posts.deletedAt))
    .orderBy(desc(posts.createdAt)).limit(20)
  return result.map(post => postSchema.parse(post))
}

export async function getTrashedPosts() {
  const result = await db.select().from(posts)
    .where(isNotNull(posts.deletedAt))
    .orderBy(desc(posts.deletedAt)).limit(20)
  return result.map(post => postSchema.parse(post))
} 