import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { env } from '@/api/env';
import * as analyticsSchema from '../schemas/schema-analytics';

const tursoClient = createClient({
	url: env.TURSO_DATABASE_URL,
	authToken: env.TURSO_AUTH_TOKEN,
});

export const analyticsDb = drizzle(tursoClient, {
	schema: analyticsSchema,
});

export type TAnalyticsDb = typeof analyticsDb;
