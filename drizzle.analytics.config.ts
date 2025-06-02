import type { Config } from 'drizzle-kit';
import { env } from '@/api/env';

export default {
    schema: './src/modules/rollyourownanalytics/server/schemas/schema-analytics.ts',
    dialect: 'turso',
    dbCredentials: {
        url: env.TURSO_DATABASE_URL,
        authToken: env.TURSO_AUTH_TOKEN,
    },
    out: './src/modules/rollyourownanalytics/server/migrations',
    verbose: true,
    strict: true,
} satisfies Config; 