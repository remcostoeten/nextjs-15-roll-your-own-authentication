import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { db } from '.'

async function runMigrations() {
    console.log('Running migrations...')
    
    try {
        await migrate(db, {
            migrationsFolder: './src/server/db/migrations'
        })
        console.log('Migrations completed successfully')
    } catch (error) {
        console.error('Migration failed:', error)
        process.exit(1)
    }
}

runMigrations() 