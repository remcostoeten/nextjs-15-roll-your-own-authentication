import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	schema: './db/schema.ts',
	out: './src/db/schema/migrations',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL!
	}
})
