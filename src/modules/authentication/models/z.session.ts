import { z } from 'zod'

export const sessionSchema = z.object({
	id: z.string().uuid(),
	userId: z.string().uuid(),
	token: z.string(),
	expiresAt: z.date(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export type Session = z.infer<typeof sessionSchema>

export const sessionCreateSchema = sessionSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})

export type SessionCreate = z.infer<typeof sessionCreateSchema>
