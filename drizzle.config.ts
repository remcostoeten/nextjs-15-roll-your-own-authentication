import type { Config } from 'drizzle-kit';

export default {
    schema: './src/server/db/schemas/*.ts',
    out: './drizzle',
    dialect: 'sqlite',
    dbCredentials: {
        url: './data/raioa.db',
    },
} satisfies Config; 