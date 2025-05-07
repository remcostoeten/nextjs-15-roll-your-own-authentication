import { z } from 'zod'

export const metricsSchema = z.object({
  totalMembers: z.number(),
  activeUsers: z.number(),
  newPosts: z.number(),
  activeProjects: z.number()
})

export const memberSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  username: z.string(),
  lastLoginAt: z.date().nullable(),
  avatarUrl: z.string().nullable().optional()
})

export const dashboardDataSchema = z.object({
  metrics: metricsSchema,
  members: z.array(memberSchema)
})

export type DashboardData = z.infer<typeof dashboardDataSchema> 