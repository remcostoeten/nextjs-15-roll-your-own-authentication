import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as analyticsSchema from '../schemas/schema-analytics';

const tursoClient = createClient({
	url: process.env.ANALYTICS_TURSO_URL!,
	authToken: process.env.ANALYTICS_TURSO_AUTH_TOKEN!,
});

export const analyticsDb = drizzle(tursoClient, {
	schema: analyticsSchema,
});

export type TAnalyticsDb = typeof analyticsDb;
