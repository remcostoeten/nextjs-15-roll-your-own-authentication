import { featureConfig } from '@/config/features.config'
import { z } from 'zod'

const passwordValidation = featureConfig.auth.passwordValidation

function createPasswordSchema() {
	if (!passwordValidation.enabled) {
		return z.string().min(1, 'Password is required')
	}

	let schema = z.string().min(
		passwordValidation.minLength,
		`Password must be at least ${passwordValidation.minLength} characters`
	)

	if (passwordValidation.requireNumbers) {
		schema = schema.regex(/\d/, 'Password must contain at least one number')
	}

	if (passwordValidation.requireSpecialChars) {
		schema = schema.regex(
			/[!@#$%^&*(),.?":{}|<>]/,
			'Password must contain at least one special character'
		)
	}

	if (passwordValidation.requireUppercase) {
		schema = schema.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
	}

	if (passwordValidation.requireLowercase) {
		schema = schema.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
	}

	return schema
}

export const registerSchema = z
	.object({
		email: z.string().email('Invalid email address'),
		password: createPasswordSchema(),
		confirmPassword: z.string().min(1, 'Password confirmation is required')
	})
	.refine((data) => data.password === data.confirmPassword, {
			message: "Passwords don't match",
			path: ['confirmPassword']
	})

export type RegisterInput = z.infer<typeof registerSchema>
