import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const getConnectionString = () => {
	const isProduction = process.env.NODE_ENV === 'production'
	const useLocalDocker = process.env.USE_LOCAL_DB === 'true'

	if (!isProduction && useLocalDocker) {
		// Local Docker PostgreSQL
		return process.env.DOCKER_DATABASE_URL
	}
	// Vercel Postgres or other cloud provider
	return process.env.POSTGRES_URL || process.env.DATABASE_URL
}

const connectionString = getConnectionString()

if (!connectionString) {
	throw new Error('Database connection URL is not defined')
}

// For migrations
export const migrationClient = postgres(connectionString, { max: 1 })

// For queries
const queryClient = postgres(connectionString)
export const db = drizzle(queryClient, { schema })
