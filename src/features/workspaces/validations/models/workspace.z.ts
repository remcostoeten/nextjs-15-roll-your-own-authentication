import { z } from 'zod'

export const workspaceSchema = z.object({
	name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
	description: z.string().max(500, 'Description is too long').optional(),
	emoji: z.string().max(2, 'Only one emoji allowed').optional()
})

export type WorkspaceFormData = z.infer<typeof workspaceSchema>
