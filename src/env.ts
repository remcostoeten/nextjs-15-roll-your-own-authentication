import { z } from 'zod'

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
const envSchema = z.object({
	// Database
	DATABASE_URL: z
		.string()
		.url()
		.default('postgresql://postgres:postgres@localhost:5432/postgres'),

	// Auth
	JWT_SECRET: z
		.string()
		.min(32)
		.default('your-development-secret-key-minimum-32-chars-long'),

	// OAuth
	GITHUB_CLIENT_ID: z.string().optional(),
	GITHUB_CLIENT_SECRET: z.string().optional(),
	GOOGLE_CLIENT_ID: z.string().optional(),
	GOOGLE_CLIENT_SECRET: z.string().optional(),
	OAUTH_REDIRECT_URL: z.string().url().optional(),

	// App
	NODE_ENV: z
		.enum(['development', 'production', 'test'])
		.default('development'),
	APP_URL: z.string().url().default('http://localhost:3000')
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
	console.error(
		'❌ Invalid environment variables:',
		JSON.stringify(parsed.error.format(), null, 2)
	)
	throw new Error('Invalid environment variables')
}

export const env = parsed.data
