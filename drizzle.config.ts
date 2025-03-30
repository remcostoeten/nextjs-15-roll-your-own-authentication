import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

export default {
  schema: './src/server/db/schemas/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.CLOUD_DATABASE_URL as string,
  },
  verbose: true,
  strict: true,
} satisfies Config;
