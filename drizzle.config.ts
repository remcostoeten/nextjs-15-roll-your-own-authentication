import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	schema: './app/server/database/schema.ts',
	out: './app/server/database/migrations',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL!
	}
})
