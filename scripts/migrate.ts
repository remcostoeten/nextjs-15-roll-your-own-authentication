import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

async function main() {
    console.log('Starting database migration...');

    // Determine the SQLite database file path
    const dbFilePath = './data/raioa.db';

    // Ensure the directory exists
    const dirPath = path.dirname(dbFilePath);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    // Create SQLite connection
    const sqlite = new Database(dbFilePath);
    const db = drizzle(sqlite);

    // Run migrations
    console.log('Running SQLite migrations...');
    await migrate(db, { migrationsFolder: './drizzle' });

    console.log('Migrations completed successfully!');

    // Close the connection
    sqlite.close();
}

main().catch((err) => {
    console.error('Migration failed!', err);
    process.exit(1);
}); 