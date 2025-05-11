import { db } from "./client";
import { Post } from "./schema";

async function check() {
    console.log("🔍 Checking database...");

    try {
        // Check if the post table exists and get all records
        const posts = await db.select().from(Post).execute();

        console.log(`✅ Post table exists with ${posts.length} records:`);
        posts.forEach(post => {
            console.log(`- ${post.id}: ${post.title}`);
        });
    } catch (error) {
        console.error("❌ Error checking database:", error);
    }
}

check()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    }); 