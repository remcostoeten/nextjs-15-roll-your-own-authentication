// Load environment variables first
require("dotenv").config()

// Then import database
const { db } = require("../server/db")
const { sql } = require("drizzle-orm")

// Verify DATABASE_URL is loaded
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set in the environment or .env file")
  console.log(
    "Available environment variables:",
    Object.keys(process.env).filter((key) => !key.includes("SECRET")),
  )
  process.exit(1)
}

console.log("DATABASE_URL is set, proceeding with migration...")

async function addIsAdmin() {
  console.log("Starting isAdmin column addition...")

  try {
    // Check if isAdmin column already exists
    try {
      await db.execute(sql`SELECT is_admin FROM users LIMIT 1`)
      console.log("isAdmin column already exists, skipping addition")
      return
    } catch (error) {
      console.log("isAdmin column does not exist, proceeding with addition")
    }

    // Begin transaction
    await db.execute(sql`BEGIN`)

    // Add isAdmin column based on role
    console.log("Adding isAdmin column to users table...")
    await db.execute(sql`
      ALTER TABLE users 
      ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT FALSE
    `)

    // Set isAdmin based on role
    console.log("Setting isAdmin based on role...")
    await db.execute(sql`
      UPDATE users 
      SET is_admin = TRUE 
      WHERE role = 'admin'
    `)

    // Commit transaction
    await db.execute(sql`COMMIT`)

    console.log("isAdmin column added successfully!")
  } catch (error) {
    // Rollback on error
    await db.execute(sql`ROLLBACK`)
    console.error("Migration failed:", error)
    throw error
  } finally {
    process.exit(0)
  }
}

addIsAdmin()

