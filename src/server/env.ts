import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
	/**
	 * Client-side environment variables
	 * These will be exposed to the browser
	 */
	client: {
		// Example: NEXT_PUBLIC_API_URL: z.string().min(1)
		NEXT_PUBLIC_BASE_URL: z.string().url().optional().default('http://localhost:3000'),
	},

	server: {
		// Node environment
		NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

		// Database configuration
		DATABASE_TYPE: z.enum(['sqlite', 'none']).default('sqlite'),
		DATABASE_URL: z.string().min(1),

		// Admin email
		ADMIN_EMAIL: z.string().min(1),
		GITHUB_TOKEN: z.string().min(1),
		GITHUB_CLIENT_SECRET: z.string().min(1),
		GITHUB_CLIENT_ID: z.string().min(1),
		// Authentication
		JWT_SECRET: z.string().min(1),
		REFRESH_TOKEN_SECRET: z.string().min(1),
		ACCESS_TOKEN_EXPIRES_IN: z.string().default('15m'),
		REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
	},

	/**
	 * Configuration options for env schema validation
	 */
	runtimeEnv: {
		// Client vars
		NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,

		// Server vars
		NODE_ENV: process.env.NODE_ENV,
		DATABASE_TYPE: process.env.DATABASE_TYPE,
		DATABASE_URL: process.env.DATABASE_URL,
		JWT_SECRET: process.env.JWT_SECRET,
		REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
		ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
		REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
		ADMIN_EMAIL: process.env.ADMIN_EMAIL,
	},

	/**
	 * Configuration options
	 */
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
})
