import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

if (!process.env.DATABASE_URL) {
	console.error('DATABASE_URL environment variable is not set')
	console.log(
		'Available environment variables:',
		Object.keys(process.env).filter((key) => !key.includes('SECRET'))
	)
	throw new Error('DATABASE_URL environment variable is not set')
}

// Create a postgres connection with proper connection pooling
const connectionString = process.env.DATABASE_URL

// Configure connection pool
const sql = postgres(connectionString, {
	max: 10, // Set max pool size to 10
	idle_timeout: 20, // Close idle connections after 20 seconds
	connect_timeout: 10, // Connection timeout after 10 seconds
	prepare: false, // Disable prepared statements for better compatibility
})

// Create a drizzle client
export const db = drizzle(sql, { schema })

// Export types
export type User = typeof schema.users.$inferSelect
export type NewUser = typeof schema.users.$inferInsert
export type Session = typeof schema.sessions.$inferSelect
export type NewSession = typeof schema.sessions.$inferInsert
