import { db } from '@/api/db'
import { unstable_cache } from 'next/cache'
import { users } from '@/api/schema'
import { userProfiles } from '@/api/schema'
import { posts, projects } from '@/api/schema'
import { sql, desc, eq, gt } from 'drizzle-orm'
import { dashboardDataSchema } from '@/modules/dashboard/models/z.dashboard-data'

async function fetchDashboardData() {
  const now = new Date()
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [[{ totalMembers }], [{ activeUsers }], [{ newPosts }], [{ activeProjects }]] = await Promise.all([
    db.select({ totalMembers: sql<number>`count(*)` }).from(users),
    db.select({ activeUsers: sql<number>`count(*)` })
      .from(userProfiles)
      .where(gt(userProfiles.lastLoginAt, last30Days)),
    db.select({ newPosts: sql<number>`count(*)` })
      .from(posts)
      .where(gt(posts.createdAt, last30Days)),
    db.select({ activeProjects: sql<number>`count(*)` })
      .from(projects)
      .where(eq(projects.status, 'active'))
  ])

  const members = await db.select({
    id: users.id,
    email: users.email,
    username: users.username,
    lastLoginAt: userProfiles.lastLoginAt,
    avatarUrl: userProfiles.githubLink
  })
    .from(users)
    .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
    .orderBy(desc(userProfiles.lastLoginAt))
    .limit(10)

  const data = {
    metrics: {
      totalMembers: totalMembers ?? 0,
      activeUsers: activeUsers ?? 0,
      newPosts: newPosts ?? 0,
      activeProjects: activeProjects ?? 0
    },
    members: members.map(m => ({
      id: m.id,
      email: m.email,
      username: m.username,
      lastLoginAt: m.lastLoginAt ?? null,
      avatarUrl: m.avatarUrl ?? null
    }))
  }

  return dashboardDataSchema.parse(data)
}

export const getDashboardData = unstable_cache(
  async () => fetchDashboardData(),
  ['dashboard-data'],
  { revalidate: 60 }
) 