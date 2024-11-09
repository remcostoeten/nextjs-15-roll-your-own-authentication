import { z } from 'zod'

export const createTaskSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().optional(),
	priority: z.enum(['low', 'medium', 'high']).default('medium'),
	dueDate: z.string().optional()
})
