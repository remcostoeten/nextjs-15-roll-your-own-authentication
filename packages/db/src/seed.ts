import { createId } from "@paralleldrive/cuid2";
import { db } from "./client";
import { Post } from "./schema";

async function seed() {
    console.log("🌱 Seeding database...");

    try {
        // First check if the post table exists by querying it
        try {
            await db.select().from(Post).limit(1).execute();
            console.log("✅ Post table already exists.");
        } catch (error) {
            console.log("❌ Post table doesn't exist. Creating...");

            // Create the post table using LibSQL raw SQL
            await db.$client.execute(`
      CREATE TABLE IF NOT EXISTS post (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at INTEGER NOT NULL DEFAULT(unixepoch()),
        updated_at INTEGER NOT NULL DEFAULT(unixepoch())
      )
    `);

            console.log("✅ Post table created.");
        }

        // Insert sample posts
        for (let i = 1; i <= 10; i++) {
            await db.insert(Post).values({
                id: createId(),
                title: `Article Title ${i}`,
                content: `Article content ${i}`,
            }).onConflictDoNothing().execute();
        }

        console.log("✅ Database seeded successfully!");
    } catch (error) {
        console.error("❌ Error seeding database:", error);
    }
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => {
        process.exit(0);
    }); 