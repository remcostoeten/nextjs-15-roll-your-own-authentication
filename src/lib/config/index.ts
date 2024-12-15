import { z } from 'zod'

const envSchema = z.object({
	DATABASE_URL: z.string().min(1),
	JWT_SECRET: z.string().min(32),
	NEXT_PUBLIC_APP_URL: z.string().url(),
	GOOGLE_CLIENT_ID: z.string().min(1),
	GOOGLE_CLIENT_SECRET: z.string().min(1),
	GITHUB_CLIENT_ID: z.string().min(1),
	GITHUB_CLIENT_SECRET: z.string().min(1)
})

export const config = {
	env: envSchema.parse(process.env),
	auth: {
		sessionDuration: 7 * 24 * 60 * 60 * 1000, // 1 week
		cookieName: 'token'
	},
	oauth: {
		stateTimeout: 5 * 60 // 5 minutes
	}
}
