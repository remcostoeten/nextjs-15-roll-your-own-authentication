import { drizzle } from 'drizzle-orm/node-postgres';
import { env } from 'env';
import pg from 'pg';
import * as schema from './schema';
const { Pool } = pg;

const pool = new Pool({
	connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
