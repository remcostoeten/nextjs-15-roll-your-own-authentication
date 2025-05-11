import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const DATABASE_URL = "file:./database.db";
console.log(`Using DATABASE_URL: ${DATABASE_URL}`);

async function main() {
    try {
        // Create client
        const client = createClient({
            url: DATABASE_URL,
        });

        console.log("Client created successfully");

        // Check if post table exists
        try {
            // Try to get the posts with SQL
            const result = await client.execute("SELECT * FROM post LIMIT 5");
            console.log("Posts from database (SQL):");
            console.log(JSON.stringify(result.rows, null, 2));

            // Also try using Drizzle
            const db = drizzle(client);
            const postsWithDrizzle = await db.query.sql.all("SELECT * FROM post LIMIT 5");
            console.log("Posts from database (Drizzle):");
            console.log(JSON.stringify(postsWithDrizzle, null, 2));

            // Count posts
            const countResult = await client.execute("SELECT COUNT(*) as count FROM post");
            console.log(`Total posts in the database: ${countResult.rows[0].count}`);

        } catch (err) {
            console.error("Error querying posts:", err);
            // List all tables to diagnose
            const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
            console.log("Tables in database:");
            console.log(tables.rows);
        }

    } catch (err) {
        console.error("Error:", err);
    }
}

main().catch(console.error); 