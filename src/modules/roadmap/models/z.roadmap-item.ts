import { z } from 'zod'

export const roadmapItemSchema = z.object({
	title: z.string().min(1),
	description: z.string().min(1),
	status: z.enum(['planned', 'in-progress', 'completed']),
	priority: z.number().int().min(0),
	startDate: z.string().optional().nullable(),
	endDate: z.string().optional().nullable(),
	quarter: z.string().min(1),
	assignee: z.string().optional().nullable(),
	tags: z.string().optional().nullable(),
	dependencies: z.string().optional().nullable(),
	progress: z.number().int().min(0).max(100).default(0),
})
