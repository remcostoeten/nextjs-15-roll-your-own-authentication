import { BASE_CONFIG } from '@/core/config/FEATURE_CONFIG'
import { z } from 'zod'

const emailValue = z.string().email('Invalid email')

const getPasswordSchema = () => {
	if (!BASE_CONFIG.passwordValidation.enabled) {
		return z.string().min(1, 'Password is required')
	}

	let schema = z
		.string()
		.min(
			BASE_CONFIG.passwordValidation.minLength,
			`Password must be at least ${BASE_CONFIG.passwordValidation.minLength} characters`
		)

	if (BASE_CONFIG.passwordValidation.requireUppercase) {
		schema = schema.regex(/[A-Z]/, 'Must contain uppercase')
	}

	if (BASE_CONFIG.passwordValidation.requireNumber) {
		schema = schema.regex(/[0-9]/, 'Must contain number')
	}

	if (BASE_CONFIG.passwordValidation.requireSpecialChar) {
		schema = schema.regex(/[^A-Za-z0-9]/, 'Must contain special character')
	}

	return schema
}

const confirmPasswordValue = z.string()

export const signUpSchema = z
	.object({
		email: emailValue,
		password: getPasswordSchema(),
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
