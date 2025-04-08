import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'

dotenv.config()

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL environment variable is not set')
}

export default {
	schema: './server/db/schema/index.ts',
	out: './server/db/migrations',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
} satisfies Config
