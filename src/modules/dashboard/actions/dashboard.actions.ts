'use server'

import { db } from '@/api/db'
import { unstable_cache } from 'next/cache'
import { z } from 'zod'

const metricsSchema = z.object({
  totalMembers: z.number(),
  activeUsers: z.number(),
  newPosts: z.number(),
  activeProjects: z.number()
})

const memberSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  avatarUrl: z.string().optional()
})

const dashboardDataSchema = z.object({
  metrics: metricsSchema,
  members: z.array(memberSchema)
})

type DashboardData = z.infer<typeof dashboardDataSchema>

async function fetchDashboardData(): Promise<DashboardData> {
  // Fetch metrics
  const [totalMembers, activeUsers, newPosts, activeProjects] = await Promise.all([
    db.query.users.count(),
    db.query.users.count({ where: { lastLoginAt: { gt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } }),
    db.query.posts.count({ where: { createdAt: { gt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } }),
    db.query.projects.count({ where: { status: 'active' } })
  
  // Fetch members
  const members = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true
    },
    orderBy: { lastLoginAt: 'desc' },
    take: 10
  })

  const data = {
    metrics: {
      totalMembers,
      activeUsers,
      newPosts,
      activeProjects
    },
    members
  }

  // Validate data
  return dashboardDataSchema.parse(data)
}

// Cache the dashboard data for 1 minute
export const getDashboardData = unstable_cache(
  async () => {
    return fetchDashboardData()
  },
  ['dashboard-data'],
  { revalidate: 60 } // 1 minute
) 