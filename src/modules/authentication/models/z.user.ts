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
export const userRegistrationSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters')
		.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
		.regex(/[0-9]/, 'Password must contain at least one number'),
	firstName: z.string().min(1, 'First name is required'),
	lastName: z.string().min(1, 'Last name is required'),
})

export type RegisterUserInput = z.infer<typeof userRegistrationSchema>

/**
 * Schema for user login
 */
export const userLoginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(1, 'Password is required'),
})

/**
 * User schema with role
 */
export const userSchema = z.object({
	id: z.string().uuid(),
	email: z.string().email(),
	name: z.string().min(2).max(100).optional(),
	password: z.string().min(8),
	role: z.enum(['USER', 'ADMIN']).default('USER'),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export const createUserSchema = userSchema.omit({ 
	id: true, 
	createdAt: true, 
	updatedAt: true 
})

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string()
})

export type User = z.infer<typeof userSchema>
export type CreateUser = z.infer<typeof createUserSchema>
export type LoginCredentials = z.infer<typeof loginSchema>

/**
 * User profile schema
 */
export const userProfileSchema = userBaseSchema
