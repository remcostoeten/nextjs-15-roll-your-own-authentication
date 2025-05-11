import { createClient } from "@libsql/client";
import { db } from "./client";
import { User, Session, Account, Verification } from "./schema";

// Log the database URL
console.log("Database URL from env:", process.env.DATABASE_URL);

// List of all database files to update
const dbPaths = [
    "file:../../database.db",              // Root database
    "file:../../apps/webapp/database.db",  // Webapp database
    "file:../database.db",                 // DB package database
    "file:../local.db"                     // Local DB
];

async function createAuthTables(dbPath: string) {
    console.log(`🔄 Processing database at: ${dbPath}`);

    try {
        const client = createClient({ url: dbPath });

        // Create users table if it doesn't exist
        try {
            const result = await client.execute("SELECT 1 FROM users LIMIT 1");
            console.log(`  ✅ Users table already exists in ${dbPath}`);
        } catch (error) {
            console.log(`  ❌ Users table doesn't exist in ${dbPath}. Creating auth tables...`);

            // Create the users table using raw SQL
            await client.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY NOT NULL,
          email TEXT NOT NULL UNIQUE,
          email_verified INTEGER DEFAULT 0,
          password TEXT,
          name TEXT,
          image TEXT,
          created_at INTEGER NOT NULL DEFAULT(unixepoch()),
          updated_at INTEGER NOT NULL DEFAULT(unixepoch())
        )
      `);

            // Create sessions table
            await client.execute(`
        CREATE TABLE IF NOT EXISTS sessions (
          id TEXT PRIMARY KEY NOT NULL,
          user_id TEXT NOT NULL,
          token TEXT NOT NULL UNIQUE,
          ip_address TEXT,
          user_agent TEXT,
          expires_at INTEGER NOT NULL,
          created_at INTEGER NOT NULL DEFAULT(unixepoch()),
          updated_at INTEGER NOT NULL DEFAULT(unixepoch()),
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);

            // Create accounts table
            await client.execute(`
        CREATE TABLE IF NOT EXISTS accounts (
          id TEXT PRIMARY KEY NOT NULL,
          user_id TEXT NOT NULL,
          account_id TEXT NOT NULL,
          provider_id TEXT NOT NULL,
          refresh_token TEXT,
          access_token TEXT,
          access_token_expires_at INTEGER,
          refresh_token_expires_at INTEGER,
          scope TEXT,
          id_token TEXT,
          password TEXT,
          created_at INTEGER NOT NULL DEFAULT(unixepoch()),
          updated_at INTEGER NOT NULL DEFAULT(unixepoch()),
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          UNIQUE (provider_id, account_id)
        )
      `);

            // Create verifications table
            await client.execute(`
        CREATE TABLE IF NOT EXISTS verifications (
          id TEXT PRIMARY KEY NOT NULL,
          identifier TEXT NOT NULL,
          value TEXT NOT NULL,
          expires_at INTEGER NOT NULL,
          created_at INTEGER NOT NULL DEFAULT(unixepoch()),
          updated_at INTEGER NOT NULL DEFAULT(unixepoch())
        )
      `);

            console.log(`  ✅ Auth tables created in ${dbPath}`);
        }

        // Verify tables
        const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
        console.log(`  📋 Tables in ${dbPath}:`, tables.rows.map(row => row.name).join(", "));

        await client.close();
        return true;
    } catch (error) {
        console.error(`  ❌ Error processing database at ${dbPath}:`, error);
        return false;
    }
}

async function seedAuthTables() {
    console.log("🌱 Seeding auth tables in all database files...");

    let successCount = 0;
    for (const dbPath of dbPaths) {
        const success = await createAuthTables(dbPath);
        if (success) successCount++;
    }

    console.log(`✅ Auth tables setup complete! Successfully processed ${successCount}/${dbPaths.length} database files.`);
}

// Run the seed function
seedAuthTables()
    .catch(console.error)
    .finally(() => {
        console.log("✅ Auth seeding complete");
    }); 