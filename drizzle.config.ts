  import { defineConfig } from 'drizzle-kit';
import { env } from 'env';

  export default defineConfig({
    out: './src/api/db/migrations',
    schema: './src/api/db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
      url: env.DATABASE_URL,
    },
  });
