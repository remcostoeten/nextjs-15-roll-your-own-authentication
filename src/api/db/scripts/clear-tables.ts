import { exec as execCallback } from 'child_process';
import { config } from 'dotenv';
import { resolve } from 'path';
import { Pool } from 'pg';
import readline from 'readline';
import { promisify } from 'util';

// Promisify exec
const exec = promisify(execCallback);

// Load environment variables from .env file
config({ path: resolve(process.cwd(), '.env') });

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

async function pushChangesToDatabase() {
	try {
		console.log('\nGenerating schema changes...');
		const { stdout: genOutput } = await exec('pnpm drizzle-kit generate');
		console.log(genOutput);

		console.log('\nPushing changes to database...');
		const { stdout: pushOutput } = await exec('pnpm drizzle-kit push');
		console.log(pushOutput);

		console.log('\n✅ Successfully updated database schema');
	} catch (error: any) {
		console.error('\n❌ Failed to update database schema:', error.message);
		throw error;
	}
}

async function clearTables() {
	// Create a new connection pool
	const pool = new Pool({
		connectionString: process.env.DATABASE_URL,
	});

	try {
		console.log('WARNING: This script will drop ALL tables in your database.');

		// Ask for confirmation
		const answer = await new Promise((resolve) => {
			rl.question('Are you absolutely sure you want to proceed? (yes/no): ', resolve);
		});

		if ((answer as string).toLowerCase() !== 'yes') {
			console.log('Operation cancelled.');
			return;
		}

		// Get all table names from the public schema
		const result = await pool.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
    `);

		const tables = result.rows.map((row) => row.tablename);

		if (tables.length === 0) {
			console.log('No tables found in the database.');
			return;
		}

		// Disable foreign key checks and start transaction
		await pool.query('BEGIN');
		await pool.query('SET CONSTRAINTS ALL DEFERRED');

		// Drop all tables
		for (const table of tables) {
			await pool.query(`DROP TABLE IF EXISTS "${table}" CASCADE`);
			console.log(`Dropped table: ${table}`);
		}

		// Commit transaction
		await pool.query('COMMIT');

		console.log('\n✅ Successfully cleared all tables from the database.');

		// Ask if they want to push the schema changes
		const pushAnswer = await new Promise((resolve) => {
			rl.question('\nDo you want to recreate the database schema? (yes/no): ', resolve);
		});

		if ((pushAnswer as string).toLowerCase() === 'yes') {
			await pushChangesToDatabase();
		} else {
			console.log('\nSkipping schema recreation. Your database is now empty.');
		}
	} catch (error) {
		// Rollback on error
		await pool.query('ROLLBACK');
		console.error('Error clearing tables:', error);
		process.exit(1);
	} finally {
		await pool.end();
		rl.close();
	}
}

// Run the script
clearTables().catch((error) => {
	console.error('Failed to clear tables:', error);
	process.exit(1);
});
