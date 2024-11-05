import type { Config } from 'drizzle-kit'

export default {
	out: './src/db/migrations',
	schema: './src/db/schema.ts',
	dialect: 'turso',
	dbCredentials: {
		url: process.env.TURSO_DATABASE_URL!,
		authToken: process.env.TURSO_AUTH_TOKEN!
	},
	verbose: true
} satisfies Config
