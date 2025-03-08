import { z } from 'zod'

/**
 * Base user schema with email and optional name fields
 */
export const userBaseSchema = z.object({
	email: z.string().email('Invalid email address'),
	firstName: z
		.string()
		.min(2, 'First name must be at least 2 characters')
		.optional(),
	lastName: z
		.string()
		.min(2, 'Last name must be at least 2 characters')
		.optional(),
})

/**
 * Schema for user registration
 * Extends base schema with password and confirmation fields
 */
export const userRegistrationSchema = userBaseSchema
	.extend({
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.regex(
				/[A-Z]/,
				'Password must contain at least one uppercase letter'
			)
			.regex(
				/[a-z]/,
				'Password must contain at least one lowercase letter'
			)
			.regex(/[0-9]/, 'Password must contain at least one number'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	})

/**
 * Schema for user login
 */
export const userLoginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(1, 'Password is required'),
})

/**
 * User profile schema
 */
export const userProfileSchema = userBaseSchema
