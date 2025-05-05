import { env } from 'env'
import type { Config } from 'drizzle-kit'

export default {
	schema: './src/api/schema/index.ts',
	out: './src/api/db/migrations',
	dialect: 'postgresql',
	dbCredentials: {
		url: env.DATABASE_URL,
	},
} satisfies Config
