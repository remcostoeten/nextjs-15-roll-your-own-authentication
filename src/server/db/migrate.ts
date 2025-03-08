import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db } from './config';

export default async function runMigrations() {
  console.log('Running migrations...');
  
  try {
    // The first argument is the DB connection, the second is the migrations folder
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Allow running directly with: node -r esbuild-register ./src/server/db/migrate.ts
if (require.main === module) {
  runMigrations();
}
