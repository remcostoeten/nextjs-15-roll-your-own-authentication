import { z } from 'zod'

export const roadmapStatusEnum = z.enum(['planned', 'in-progress', 'completed', 'cancelled'])
export const roadmapPriorityEnum = z.enum(['low', 'medium', 'high', 'critical'])
export const roadmapCategoryEnum = z.enum([
	'feature',
	'improvement',
	'bugfix',
	'security',
	'performance',
	'documentation',
])

export const roadmapCommentSchema = z.object({
	id: z.string().uuid(),
	content: z.string().min(1).max(1000),
	createdAt: z.string().datetime(),
	createdBy: z.string().uuid(),
	updatedAt: z.string().datetime().optional(),
})

export const roadmapItemSchema = z.object({
	id: z.string().uuid(),
	title: z.string().min(3).max(100),
	description: z.string().min(10).max(2000),
	status: roadmapStatusEnum,
	priority: roadmapPriorityEnum,
	category: roadmapCategoryEnum,
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	createdBy: z.string().uuid(),
	assignedTo: z.string().uuid().optional(),
	dueDate: z.string().datetime().optional(),
	votes: z.number().int().nonnegative(),
	comments: z.array(roadmapCommentSchema),
	tags: z.array(z.string().min(1).max(20)),
})

export const createRoadmapItemSchema = roadmapItemSchema
	.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
		votes: true,
		comments: true,
	})
	.extend({
		tags: z.array(z.string().min(1).max(20)).optional(),
	})

export const updateRoadmapItemSchema = roadmapItemSchema.partial().omit({
	id: true,
	createdAt: true,
	createdBy: true,
	votes: true,
	comments: true,
})

export type RoadmapItem = z.infer<typeof roadmapItemSchema>
export type CreateRoadmapItem = z.infer<typeof createRoadmapItemSchema>
export type UpdateRoadmapItem = z.infer<typeof updateRoadmapItemSchema>
