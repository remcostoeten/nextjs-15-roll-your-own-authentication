import { db, sql } from "../server/db/index-for-scripts.js"
import * as dotenv from "dotenv"

dotenv.config()

async function safeMigration() {
  console.log("Starting safe migration...")

  try {
    // Begin transaction
    await db.execute(sql`BEGIN`)

    // 1. Handle the sessions table id column (text to uuid)
    console.log("Migrating sessions table...")

    // Create a temporary sessions table with the new schema
    await db.execute(sql`
      CREATE TABLE temp_sessions (
        id UUID PRIMARY KEY,
        user_id VARCHAR(128) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        last_used_at TIMESTAMP NOT NULL DEFAULT NOW(),
        ip_address VARCHAR(45),
        user_agent TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // Copy data with explicit casting
    await db.execute(sql`
      INSERT INTO temp_sessions (id, user_id, expires_at, created_at, last_used_at, ip_address, user_agent)
      SELECT 
        id::UUID, 
        user_id, 
        expires_at, 
        created_at, 
        last_used_at, 
        ip_address, 
        user_agent
      FROM sessions
    `)

    // Drop old table and rename new one
    await db.execute(sql`DROP TABLE sessions`)
    await db.execute(sql`ALTER TABLE temp_sessions RENAME TO sessions`)

    // 2. Handle the users table changes
    console.log("Migrating users table...")

    // Add isAdmin column based on role
    await db.execute(sql`
      ALTER TABLE users 
      ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT FALSE
    `)

    // Set isAdmin based on role
    await db.execute(sql`
      UPDATE users 
      SET is_admin = TRUE 
      WHERE role = 'admin'
    `)

    // Convert text columns to varchar
    await db.execute(sql`
      ALTER TABLE users 
      ALTER COLUMN username TYPE VARCHAR(255),
      ALTER COLUMN email TYPE VARCHAR(255),
      ALTER COLUMN password TYPE VARCHAR(255),
      ALTER COLUMN first_name TYPE VARCHAR(255),
      ALTER COLUMN last_name TYPE VARCHAR(255)
    `)

    // 3. Handle the notifications table changes
    console.log("Migrating notifications table...")

    // Create a temporary notifications table with the new schema
    await db.execute(sql`
      CREATE TABLE temp_notifications (
        id VARCHAR(128) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        type VARCHAR(50) NOT NULL DEFAULT 'info',
        created_by_id VARCHAR(128) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        expires_at TIMESTAMP,
        link VARCHAR(255),
        is_global BOOLEAN NOT NULL DEFAULT FALSE,
        metadata JSONB,
        workspace_id VARCHAR(128),
        FOREIGN KEY (created_by_id) REFERENCES users(id),
        FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
      )
    `)

    // Copy data with transformations
    await db.execute(sql`
      INSERT INTO temp_notifications (
        id, title, content, type, created_by_id, created_at, 
        expires_at, link, is_global, metadata
      )
      SELECT 
        id, 
        title, 
        message AS content, 
        'info' AS type, 
        user_id AS created_by_id, 
        created_at, 
        NULL AS expires_at, 
        NULL AS link, 
        FALSE AS is_global, 
        NULL AS metadata
      FROM notifications
    `)

    // Drop old table and rename new one
    await db.execute(sql`DROP TABLE notifications`)
    await db.execute(sql`ALTER TABLE temp_notifications RENAME TO notifications`)

    // Commit transaction
    await db.execute(sql`COMMIT`)

    console.log("Migration completed successfully!")
  } catch (error) {
    // Rollback on error
    await db.execute(sql`ROLLBACK`)
    console.error("Migration failed:", error)
    throw error
  } finally {
    process.exit(0)
  }
}

safeMigration()

