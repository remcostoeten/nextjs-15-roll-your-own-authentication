#!/usr/bin/env node
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import { exec } from "child_process"
import * as fs from "fs"
import * as path from "path"
import * as readline from "readline"
import * as schema from "../server/db/schema"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

async function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer)
    })
  })
}

async function execCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`)
        reject(error)
        return
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`)
      }
      resolve(stdout)
    })
  })
}

// Get database URL from environment or use default
const dbUrl = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/auth_db"

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: dbUrl,
})

// Create a Drizzle instance
const db = drizzle(pool, { schema })

async function main() {
  console.log("🚀 Setting up PostgreSQL database with Docker...")

  // Check if Docker is installed
  try {
    await execCommand("docker --version")
    console.log("✅ Docker is installed")
  } catch (error) {
    console.error("❌ Docker is not installed. Please install Docker first.")
    process.exit(1)
  }

  // Ask for database name, user, and password
  const dbName = (await question("Enter database name (default: auth_db): ")) || "auth_db"
  const dbUser = (await question("Enter database user (default: postgres): ")) || "postgres"
  const dbPassword = (await question("Enter database password (default: postgres): ")) || "postgres"
  const dbPort = (await question("Enter database port (default: 5432): ")) || "5432"

  // Create Docker container
  console.log("\n🐳 Creating Docker container...")
  try {
    await execCommand(
      `docker run --name ${dbName}-postgres -e POSTGRES_PASSWORD=${dbPassword} -e POSTGRES_USER=${dbUser} -e POSTGRES_DB=${dbName} -p ${dbPort}:5432 -d postgres:14`,
    )
    console.log(`✅ PostgreSQL container created with name: ${dbName}-postgres`)
  } catch (error) {
    console.error("❌ Failed to create Docker container. It might already exist.")
    const shouldRemove = await question("Do you want to remove the existing container and create a new one? (y/n): ")

    if (shouldRemove.toLowerCase() === "y") {
      try {
        await execCommand(`docker rm -f ${dbName}-postgres`)
        console.log(`✅ Removed existing container: ${dbName}-postgres`)

        await execCommand(
          `docker run --name ${dbName}-postgres -e POSTGRES_PASSWORD=${dbPassword} -e POSTGRES_USER=${dbUser} -e POSTGRES_DB=${dbName} -p ${dbPort}:5432 -d postgres:14`,
        )
        console.log(`✅ PostgreSQL container created with name: ${dbName}-postgres`)
      } catch (innerError) {
        console.error("❌ Failed to create Docker container:", innerError)
        process.exit(1)
      }
    } else {
      console.log("Using existing container...")
    }
  }

  // Wait for PostgreSQL to start
  console.log("\n⏳ Waiting for PostgreSQL to start...")
  await new Promise((resolve) => setTimeout(resolve, 3000))

  // Create or update .env file
  console.log("\n📝 Updating .env file...")
  const envPath = path.join(process.cwd(), ".env")
  const databaseUrl = `postgres://${dbUser}:${dbPassword}@localhost:${dbPort}/${dbName}`

  try {
    let envContent = ""

    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, "utf8")

      // Check if DATABASE_URL already exists
      if (envContent.includes("DATABASE_URL=")) {
        // Replace existing DATABASE_URL
        envContent = envContent.replace(/DATABASE_URL=.*/, `DATABASE_URL="${databaseUrl}"`)
      } else {
        // Add DATABASE_URL to the end
        envContent += `\nDATABASE_URL="${databaseUrl}"\n`
      }
    } else {
      // Create new .env file
      envContent = `DATABASE_URL="${databaseUrl}"\n`
    }

    fs.writeFileSync(envPath, envContent)
    console.log("✅ .env file updated with DATABASE_URL")
  } catch (error) {
    console.error("❌ Failed to update .env file:", error)
  }

  console.log("\n🎉 Database setup complete!")
  console.log(`\nConnection string: ${databaseUrl}`)
  console.log("\nNext steps:")
  console.log("1. Run 'npm run db:push' to push the schema to the database")
  console.log("2. Run 'npm run dev' to start the development server")

  rl.close()
}

// Get database URL from environment or use default
// const dbUrl = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/auth_db";

// // Create a PostgreSQL connection pool
// const pool = new Pool({
//   connectionString: dbUrl,
// });

// // Create a Drizzle instance
// const db = drizzle(pool, { schema });

// async function main2() {
//   console.log("Setting up database...")

//   try {
//     // Run migrations if they exist
//     try {
//       console.log("Running migrations...")
//       await migrate(db, { migrationsFolder: "drizzle" })
//       console.log("Migrations completed successfully")
//     } catch (err) {
//       console.warn("No migrations found or error running migrations:", err)
//       console.log("Continuing with setup...")
//     }

//     // Check if admin user exists
//     const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com"
//     const existingAdmin = await db.query.users.findFirst({
//       where: (users, { eq }) => eq(users.email, adminEmail),
//     })

//     if (existingAdmin) {
//       console.log(`Admin user already exists: ${adminEmail}`)
//     } else {
//       // Create admin user
//       console.log(`Creating admin user: ${adminEmail}`)

//       // Generate a secure password or use a default for development
//       const adminPassword = process.env.ADMIN_PASSWORD || "adminpassword"

//       // Hash the password
//       const hashedPassword = await bcrypt.hash(adminPassword, 10)

//       await db.insert(schema.users).values({
//         id: createId(),
//         email: adminEmail,
//         username: "admin",
//         firstName: "Admin",
//         lastName: "User",
//         password: hashedPassword,
//         isAdmin: true,
//         isVerified: true,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       })

//       console.log("Admin user created successfully")
//     }

//     // Create a sample workspace if none exists
//     const existingWorkspace = await db.query.workspaces.findFirst()

//     if (existingWorkspace) {
//       console.log("Sample workspace already exists")
//     } else {
//       console.log("Creating sample workspace...")

//       // Get the admin user
//       const admin = await db.query.users.findFirst({
//         where: (users, { eq }) => eq(users.email, adminEmail),
//       })

//       if (!admin) {
//         throw new Error("Admin user not found")
//       }

//       // Create workspace
//       const workspaceId = createId()
//       await db.insert(schema.workspaces).values({
//         id: workspaceId,
//         name: "Sample Workspace",
//         slug: "sample-workspace",
//         description: "This is a sample workspace created during setup",
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       })

//       // Add admin as workspace member
//       await db.insert(schema.workspaceMembers).values({
//         id: createId(),
//         workspaceId: workspaceId,
//         userId: admin.id,
//         role: "owner",
//         joinedAt: new Date(),
//       })

//       console.log("Sample workspace created successfully")
//     }

//     console.log("Database setup completed successfully")
//   } catch (error) {
//     console.error("Error setting up database:", error)
//     process.exit(1)
//   } finally {
//     // Close the database connection
//     await pool.end()
//     rl.close()
//   }
// }

// // main().catch((error) => {
//   console.error("Error:", error)
//   process.exit(1)
// })

// main2()

#
!/usr/bin / env
node
\
import { drizzle as drizzle2 } from "drizzle-orm/node-postgres"
import { migrate as migrate2 } from "drizzle-orm/node-postgres/migrator"
import { Pool as Pool2 } from "pg"
import * as schema2 from "../server/db/schema"
import bcryptjs from "bcryptjs"
import { createId } from "@paralleldrive/cuid2"

console.log("Setting up database...")

// Get database URL from environment
const dbUrl2 = process.env.DATABASE_URL
if (!dbUrl2) {
  console.error("DATABASE_URL environment variable is not set")
  process.exit(1)
}

// Create a PostgreSQL connection pool
const pool2 = new Pool2({
  connectionString: dbUrl2,
})

// Create a Drizzle instance
const db2 = drizzle2(pool2, { schema: schema2 })

async function main2() {
  try {
    // Run migrations if they exist
    try {
      console.log("Running migrations...")
      await migrate2(db2, { migrationsFolder: "drizzle" })
      console.log("Migrations completed successfully")
    } catch (err) {
      console.warn("No migrations found or error running migrations:", err)
      console.log("Continuing with setup...")
    }

    // Check if admin user exists
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com"
    const existingAdmin = await db2.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, adminEmail),
    })

    if (existingAdmin) {
      console.log(`Admin user already exists: ${adminEmail}`)
    } else {
      // Create admin user
      console.log(`Creating admin user: ${adminEmail}`)

      // Generate a secure password or use a default for development
      const adminPassword = process.env.ADMIN_PASSWORD || "adminpassword"

      // Hash the password
      const hashedPassword = await bcryptjs.hash(adminPassword, 10)

      await db2.insert(schema2.users).values({
        id: createId(),
        email: adminEmail,
        username: "admin",
        firstName: "Admin",
        lastName: "User",
        password: hashedPassword,
        isAdmin: true,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      console.log("Admin user created successfully")
    }

    // Create a sample workspace if none exists
    const existingWorkspace = await db2.query.workspaces.findFirst()

    if (existingWorkspace) {
      console.log("Sample workspace already exists")
    } else {
      console.log("Creating sample workspace...")

      // Get the admin user
      const admin = await db2.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, adminEmail),
      })

      if (!admin) {
        throw new Error("Admin user not found")
      }

      // Create workspace
      const workspaceId = createId()
      await db2.insert(schema2.workspaces).values({
        id: workspaceId,
        name: "Sample Workspace",
        slug: "sample-workspace",
        description: "This is a sample workspace created during setup",
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Add admin as workspace member
      await db2.insert(schema2.workspaceMembers).values({
        id: createId(),
        workspaceId: workspaceId,
        userId: admin.id,
        role: "owner",
        joinedAt: new Date(),
      })

      console.log("Sample workspace created successfully")
    }

    console.log("Database setup completed successfully")
  } catch (error) {
    console.error("Error setting up database:", error)
    process.exit(1)
  } finally {
    // Close the database connection
    await pool2.end()
    rl.close()
  }
}

main2()

