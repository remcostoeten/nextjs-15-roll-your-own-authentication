import { BASE_CONFIG } from '@/core/config/FEATURE_CONFIG'
import { z } from 'zod'

/**
 * Represents the schema for email validation.
 */
const emailValue = z.string().email('Invalid email')

/**
 * Dynamically generates the password schema based on the environment configuration.
 *
 * If password validation is disabled, the password must be at least 1 character long.
 * If password validation is enabled, the password must meet the following criteria:
 * - At least the minimum length specified in the configuration
 * - Contains at least one uppercase letter if required
 * - Contains at least one number if required
 * - Contains at least one special character if required
 */
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

/**
 * Represents the schema for confirming the password.
 */
const confirmPasswordValue = z.string()

/**
 * Represents the schema for the sign-up form.
 *
 * Validates the email, password, and confirm password fields.
 * Ensures the password and confirm password fields match.
 */
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

/**
 * Represents the type of the sign-up schema.
 */
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
