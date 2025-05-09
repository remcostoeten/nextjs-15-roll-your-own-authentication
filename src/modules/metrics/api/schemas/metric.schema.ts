import { z } from 'zod'

export const metricSchema = z.object({
  totalUsers: z.number(),
  activeUsers: z.number(),
  totalPosts: z.number(),
  engagement: z.number(),
})

export type Metric = z.infer<typeof metricSchema> 