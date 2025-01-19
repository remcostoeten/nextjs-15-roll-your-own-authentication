// index.ts
import { dbClient } from './db-client';

declare global {
  // eslint-disable-next-line no-var
  var dbClient: typeof dbClient | undefined;
}

const db = globalThis.dbClient || dbClient;

if (process.env.NODE_ENV !== 'production') {
  globalThis.dbClient = db;
}

export { db };
export default db;