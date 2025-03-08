import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schemas';
import fs from 'fs';
import path from 'path';

// Determine the SQLite database file path
const dbFilePath = './data/raioa.db';

// Ensure the directory exists
const dirPath = path.dirname(dbFilePath);
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
}

// Create SQLite connection
const sqlite = new Database(dbFilePath);

// Create a Drizzle instance with the schema
export const db = drizzle(sqlite, { schema }); 