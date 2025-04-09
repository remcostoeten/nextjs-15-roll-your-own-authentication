import { z } from 'zod'

export const userSchema = z.object({
	id: z.string().uuid(),
	email: z.string().email(),
	password: z.string().min(8),
	name: z.string().min(2).optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export type User = z.infer<typeof userSchema>

export const userCreateSchema = userSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})

export const userLoginSchema = z.object({
	email: z.string().email(),
	password: z.string(),
})

export type UserCreate = z.infer<typeof userCreateSchema>
export type UserLogin = z.infer<typeof userLoginSchema>
