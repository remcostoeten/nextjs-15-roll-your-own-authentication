// src/api/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from 'env'; 
import * as schema from '@/api/schema'; 

// Disable prefetch as it is not supported for "Transaction" pool mode
// Prevent memory connection issues with serverless environments
const queryClient = postgres(env.DATABASE_URL, { prepare: false });

// Instantiate the Drizzle client
// Pass the schema to the drizzle instance to enable Drizzle Query API
export const db = drizzle(queryClient, { schema, logger: false });
// logger: true can be useful for debugging SQL queries during development

// Optional: If you need a separate client specifically for migrations (e.g., in scripts)
// const migrationClient = postgres(env.DATABASE_URL, { max: 1 });
// export const migrationDb = drizzle(migrationClient);

