import { z } from 'zod'

export const serverSchema = z.object({
	JWT_SECRET: z.string().min(32, 'JWT Secret must be at least 32 characters'),
	NODE_ENV: z.enum(['development', 'test', 'production']),
	RATE_LIMIT_WINDOW: z.number().min(1).default(60000), // 1 minute in ms
	RATE_LIMIT_MAX_REQUESTS: z.number().min(1).default(5),
	RATE_LIMIT_BLOCK_DURATION: z.number().min(1).default(900000) // 15 minutes in ms
})

export const clientSchema = z.object({
	// Add any client-side env vars here
})
