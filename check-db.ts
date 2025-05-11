import { createClient } from "@libsql/client";

const DATABASE_URL = process.env.DATABASE_URL || "file:./database.db";
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
            const result = await client.execute("SELECT COUNT(*) as count FROM post");
            console.log(`Table 'post' exists with ${result.rows[0].count} records`);
        } catch (err) {
            console.log("Table 'post' does not exist, creating...");

            // Create the table
            await client.execute(`
        CREATE TABLE IF NOT EXISTS post (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at INTEGER NOT NULL DEFAULT(unixepoch()),
          updated_at INTEGER NOT NULL DEFAULT(unixepoch())
        )
      `);

            console.log("Table 'post' created successfully");

            // Insert sample data
            await client.execute(`
        INSERT INTO post (id, title, content, created_at, updated_at)
        VALUES 
          ('1', 'First Post', 'This is the first post content', unixepoch(), unixepoch()),
          ('2', 'Second Post', 'This is the second post content', unixepoch(), unixepoch()),
          ('3', 'Third Post', 'This is the third post content', unixepoch(), unixepoch())
      `);

            console.log("Sample data inserted");
        }

        // Verify data
        const posts = await client.execute("SELECT * FROM post LIMIT 5");
        console.log("Posts in database:");
        console.log(posts.rows);

        console.log("Database check completed successfully");
    } catch (err) {
        console.error("Error:", err);
    }
}

main().catch(console.error); 