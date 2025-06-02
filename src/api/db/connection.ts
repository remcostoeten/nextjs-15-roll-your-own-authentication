import { drizzle } from 'drizzle-orm/node-postgres';
import { drizzle as drizzleSqlite } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { env } from '@/api/env';
import pg from 'pg';
import * as mainSchema from './schema';
import * as analyticsSchema from '@/modules/rollyourownanalytics/server/schemas/schema-analytics';

const { Pool } = pg;

// PostgreSQL connection
const pgPool = new Pool({
	connectionString: env.DATABASE_URL,
});

// Turso/SQLite connection
const tursoClient = createClient({
	url: env.TURSO_DATABASE_URL,
	authToken: env.TURSO_AUTH_TOKEN,
});

// Export separate database instances for each connection
export const db = drizzle(pgPool, { schema: mainSchema });
export const analyticsDb = drizzleSqlite(tursoClient, { schema: analyticsSchema });

// Helper function to ensure connections are properly closed
export async function closeConnections() {
	await pgPool.end();
	await tursoClient.close();
}
