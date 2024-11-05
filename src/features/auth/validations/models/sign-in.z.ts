import { z } from 'zod'

/**
 * Schema for validating sign-in credentials.
 *
 * This schema validates the following fields:
 * - `email`: A string that must be a valid email address. If the email is invalid, an error message 'Invalid email' will be shown.
 * - `password`: A string that must have at least 1 character. If the password is empty, an error message 'Required' will be shown.
 */
export const signInSchema = z.object({
	email: z.string().email('Invalid email'),
	password: z.string().min(1, 'Required')
})
