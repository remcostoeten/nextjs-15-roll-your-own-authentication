import { migrate } from 'drizzle-orm/libsql/migrator'
import { db } from './index'

export async function runMigrations() {
	console.log('Running migrations...')

	try {
		await migrate(db, { migrationsFolder: './drizzle' })
		console.log('✅ Migrations completed successfully')
	} catch (error) {
		console.error('❌ Error running migrations:', error)
		process.exit(1)
	}
}

// Run migrations if this file is executed directly
if (import.meta.url === import.meta.resolve('./migrate.ts')) {
	runMigrations()
}
