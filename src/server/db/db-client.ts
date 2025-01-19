// db-client.ts

/**
 * @author Remco Stoeten
 * @description Agnostic database client that supports both Prisma and Drizzle
 * @description Defaults to Prisma if no DB_CLIENT env variable is set
 */

import { PrismaClient, Prisma } from '@prisma/client';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from '@/env';
// Import other ORMs or database clients here, e.g., Drizzle

/**
 * Type definition for supported database clients
 */
type SupportedDBClients = 'prisma' | 'drizzle';

/**
 * Type definition for the database client
 */
type DBClient = PrismaClient | ReturnType<typeof drizzle>;

/**
 * Type definition for environment
 */
type Environment = 'development' | 'production' | 'test';

/**
 * Configuration for database clients
 */
const DB_CONFIG: Record<Environment, { logging: Prisma.LogLevel[] }> = {
  development: {
    logging: ['query', 'error', 'warn']
  },
  production: {
    logging: ['error']
  },
  test: {
    logging: ['error']
  }
} as const;

/**
 * Initialize database client based on environment
 */
function createDBClient(): DBClient {
  const dbClient = (process.env.DB_CLIENT || 'prisma').toLowerCase() as SupportedDBClients;
  const environment = (process.env.NODE_ENV || 'development') as Environment;
  const logging = DB_CONFIG[environment].logging;

  switch (dbClient) {
    case 'drizzle': {
      const pool = new Pool({
        connectionString: env.DATABASE_URL
      });
      return drizzle(pool);
    }
    case 'prisma':
    default: {
      return new PrismaClient({
        log: logging
      });
    }
  }
}

// Initialize the database client
const dbClient = createDBClient();

export { dbClient };
export type { DBClient };

/**
 * @example usage
 * import { dbClient } from '@/server/db/db-client'
 * 
 * // Prisma usage
 * const users = await dbClient.user.findMany()
 * 
 * // Drizzle usage (when DB_CLIENT=drizzle)
 * import { users } from '@/server/db/schema'
 * const allUsers = await dbClient.select().from(users)
 */