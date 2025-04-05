import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

// Check if we have a database URL
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set")
  console.log(
    "Available environment variables:",
    Object.keys(process.env).filter((key) => !key.includes("SECRET")),
  )
  throw new Error("DATABASE_URL environment variable is not set")
}

// Create a postgres connection
const connectionString = process.env.DATABASE_URL
const client = postgres(connectionString)

// Create a drizzle client
export const db = drizzle(client, { schema })

// Export types
export type User = typeof schema.users.$inferSelect
export type NewUser = typeof schema.users.$inferInsert
export type Session = typeof schema.sessions.$inferSelect
export type NewSession = typeof schema.sessions.$inferInsert

