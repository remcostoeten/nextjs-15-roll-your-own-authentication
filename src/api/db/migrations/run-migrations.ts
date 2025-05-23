import { migrateUsers } from './migrate-users';

async function runMigrations() {
	try {
		console.log('Starting migrations...');
		await migrateUsers();
		console.log('All migrations completed successfully');
	} catch (error) {
		console.error('Migration failed:', error);
		process.exit(1);
	}
}

runMigrations();
