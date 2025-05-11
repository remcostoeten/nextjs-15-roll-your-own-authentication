import { createId } from "@paralleldrive/cuid2";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { sql } from "drizzle-orm";

const client = createClient({
    url: "file:./database.db",
});

// Run the seed script
async function main() {
    console.log("🌱 Seeding database...");

    try {
        // Create the post table
        await client.execute(`
      CREATE TABLE IF NOT EXISTS post (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at INTEGER NOT NULL DEFAULT(unixepoch()),
        updated_at INTEGER NOT NULL DEFAULT(unixepoch())
      )
    `);

        console.log("✅ Table created");

        // Insert some sample data
        for (let i = 1; i <= 10; i++) {
            await client.execute({
                sql: `
          INSERT INTO post (id, title, content, created_at, updated_at)
          VALUES (?, ?, ?, unixepoch(), unixepoch())
          ON CONFLICT (id) DO NOTHING
        `,
                args: [createId(), `Article Title ${i}`, `Article content ${i}`]
            });
        }

        console.log("✅ Sample data inserted");

        // Verify the data
        const result = await client.execute("SELECT COUNT(*) as count FROM post");
        console.log(`✅ Database has ${result.rows[0].count} posts`);

        console.log("✅ Database seeded successfully");
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
}

main()
    .catch(console.error)
    .finally(() => {
        client.close();
        process.exit(0);
    }); 