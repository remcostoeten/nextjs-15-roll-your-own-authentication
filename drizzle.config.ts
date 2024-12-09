import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config()

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL

if (!connectionString) {
	throw new Error('Database connection URL is not defined')
}

export default defineConfig({
	schema: './src/server/db/schema.ts',
	out: './src/server/db/migrations',
	dialect: 'postgresql',
	dbCredentials: {
		url: connectionString,
	},
	verbose: true,
})
