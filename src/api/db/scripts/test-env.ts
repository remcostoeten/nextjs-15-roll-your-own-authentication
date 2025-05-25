import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file
config({ path: resolve(process.cwd(), '.env') });

console.log('Environment Variables Test');
console.log('=========================');
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✓ Set' : '✗ Not Set');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('GITHUB_CLIENT_ID:', process.env.GITHUB_CLIENT_ID ? '✓ Set' : '✗ Not Set');
console.log('GITHUB_CLIENT_SECRET:', process.env.GITHUB_CLIENT_SECRET ? '✓ Set' : '✗ Not Set');
console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL);

// Test database connection
import { Pool } from 'pg';

async function testConnection() {
	const pool = new Pool({
		connectionString: process.env.DATABASE_URL,
	});

	try {
		console.log('\nTesting Database Connection...');
		const client = await pool.connect();
		console.log('✓ Successfully connected to database');
		const result = await client.query('SELECT current_database()');
		console.log('Current database:', result.rows[0].current_database);
		client.release();
	} catch (error: any) {
		console.error('✗ Failed to connect to database:', error.message);
	} finally {
		await pool.end();
	}
}

testConnection();
