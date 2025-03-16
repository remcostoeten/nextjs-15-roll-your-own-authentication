import type { Config } from 'drizzle-kit'
import { env } from 'env'

export default {
	schema: './src/server/db/schemas/*.ts',
	out: './src/server/db/migrations',
	dialect: 'sqlite',
	dbCredentials: {
		url: env.DATABASE_URL,
	},
} satisfies Config
