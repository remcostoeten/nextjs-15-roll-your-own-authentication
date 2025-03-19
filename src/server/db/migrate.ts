import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { db } from './config'
import path from 'path'

export default async function runMigrations() {
	console.log('Running migrations...')

	try {
		// The first argument is the DB connection, the second is the migrations folder
		// Use the migrations folder in src/server/db/migrations
		await migrate(db, {
			migrationsFolder: path.resolve(__dirname, 'migrations'),
		})
		console.log('Migrations completed successfully')
	} catch (error) {
		console.error('Migration failed:', error)
		process.exit(1)
	}
}

// Allow running directly with: node -r esbuild-register ./src/server/db/migrate.ts
if (require.main === module) {
	runMigrations()
}
