import { z } from 'zod'

const testMode = process.env.EASY_VALIDATION === 'true'

const emailValue = z.string().email('Invalid email')

const passwordValue = testMode
	? z.string().min(3, 'Password must be at least 3 characters')
	: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.regex(/[A-Z]/, 'Must contain uppercase')
			.regex(/[0-9]/, 'Must contain number')
			.regex(/[^A-Za-z0-9]/, 'Must contain special character')

const confirmPasswordValue = z.string()

export const signUpSchema = z
	.object({
		email: emailValue,
		password: passwordValue,
		confirmPassword: confirmPasswordValue
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	})

export type SignUpSchema = z.infer<typeof signUpSchema>

/**
 * Validates the password based on the environment mode.
 *
 * In test mode, the password must be at least 3 characters long.
 * In production mode, the password must meet the following criteria:
 * - At least 8 characters long
 * - Contains at least one uppercase letter
 * - Contains at least one number
 * - Contains at least one special character
 */
