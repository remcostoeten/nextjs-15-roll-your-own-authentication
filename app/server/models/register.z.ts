import { z } from 'zod'

export const registerSchema = z
	.object({
		email: z.string().email('Invalid email address'),
		password: z.string().min(8, 'Password must be at least 8 characters'),
		confirmPassword: z.string().min(8, 'Password confirmation is required')
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	})

export type RegisterInput = z.infer<typeof registerSchema>
