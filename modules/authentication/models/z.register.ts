import { z } from 'zod'

export const registerSchema = z.object({
	firstName: z.string().min(1, 'First name is required'),
	lastName: z.string().min(1, 'Last name is required'),
	email: z.string().email('Invalid email address'),
	username: z.string().min(3, 'Username must be at least 3 characters'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const loginSchema = z.object({
	emailOrUsername: z.string().min(1, 'Email or username is required'),
	password: z.string().min(1, 'Password is required'),
})
