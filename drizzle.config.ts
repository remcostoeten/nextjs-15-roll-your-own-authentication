import type { Config } from 'drizzle-kit'

export default {
	schema: './src/server/db/schemas/*',
	out: './drizzle',
	dialect: 'sqlite',
	dbCredentials: {
		url: process.env.DATABASE_URL || 'file:database.db',
	},
} satisfies Config
