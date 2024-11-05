import { z } from 'zod'

export const signUpSchema = z
	.object({
		email: z.string().email('Invalid email'),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.regex(/[A-Z]/, 'Must contain uppercase')
			.regex(/[0-9]/, 'Must contain number')
			.regex(/[^A-Za-z0-9]/, 'Must contain special character'),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	})
