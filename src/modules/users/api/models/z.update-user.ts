import { z } from 'zod'

export const userUpdateSchema = z.object({
	id: z.string(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	avatarUrl: z.string().url().optional().nullable(),
	avatarDeleted: z.boolean().optional(),
	email: z.string().email().optional(),
})
