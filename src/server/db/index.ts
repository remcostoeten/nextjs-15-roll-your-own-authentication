import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const getConnectionString = () => {
	const isProduction = process.env.NODE_ENV === 'production'
	const useLocalDocker = process.env.USE_LOCAL_DB === 'true'
	const connectionString = !isProduction && useLocalDocker 
		? process.env.DOCKER_DATABASE_URL
		: process.env.DATABASE_URL || process.env.POSTGRES_URL

	if (!connectionString) {
		throw new Error(
			'Database connection URL is not defined.\n' +
			'Please set DATABASE_URL in your .env file.\n' +
			'For local development with Docker, set USE_LOCAL_DB=true and DOCKER_DATABASE_URL.'
		)
	}

	return connectionString
}

// Common postgres options for Neon
const postgresOptions = {
	ssl: true, // Always use SSL for Neon
	max: 1, // Limit connections
	idle_timeout: 20, // Close idle connections after 20 seconds
	connect_timeout: 10, // Connection timeout after 10 seconds
	connection: {
		options: `--cluster=ep-late-king-a2e5jfa6-pooler` // Add Neon cluster option
	}
}

// Initialize database clients
let migrationClient: postgres.Sql | null = null
let db: ReturnType<typeof drizzle> | null = null

try {
	const connectionString = getConnectionString()

	// For migrations
	migrationClient = postgres(connectionString, {
		...postgresOptions,
		max: 1, // Ensure single connection for migrations
	})

	// For queries
	const queryClient = postgres(connectionString, postgresOptions)
	db = drizzle(queryClient, { schema })

} catch (error) {
	console.error('Failed to initialize database connection:', error)
	throw error
}

// Export initialized clients
export { db, migrationClient }

// Throw if db is not initialized
if (!db) {
	throw new Error('Database failed to initialize')
}
