import { z } from 'zod'

const envSchema = z.object({
	// Database (Turso)
	TURSO_DATABASE_URL: z.string().url(),
	TURSO_AUTH_TOKEN: z.string().min(1),

	// Auth
	JWT_SECRET: z.string().min(32),
	ADMIN_EMAIL: z.string().email().optional(),

	// Environment
	NODE_ENV: z
		.enum(['development', 'production', 'test'])
		.default('development'),

	// Optional feature flags
	NEXT_PUBLIC_SHOW_SESSION_INDICATOR: z
		.string()
		.transform((val) => val === 'true')
		.default('false')
})

declare global {
	namespace NodeJS {
		interface ProcessEnv extends z.infer<typeof envSchema> {}
	}
}

export function validateEnv() {
	try {
		const parsed = envSchema.parse(process.env)
		return parsed
	} catch (error) {
		if (error instanceof z.ZodError) {
			const { fieldErrors } = error.flatten()
			const errorMessages = Object.entries(fieldErrors)
				.map(([field, errors]) => `${field}: ${errors?.join(', ')}`)
				.join('\n  ')

			throw new Error(
				`❌ Invalid environment variables:\n  ${errorMessages}\n\nPlease check your .env file.`
			)
		}
		throw error
	}
}

export const env = validateEnv()
