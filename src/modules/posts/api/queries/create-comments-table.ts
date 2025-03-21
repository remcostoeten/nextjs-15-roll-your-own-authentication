'use server'

import { db } from '@/server/db'
import { sql } from 'drizzle-orm'

export async function createCommentsTable() {
	try {
		const checkTableExists = await db.run(
			sql`SELECT name FROM sqlite_master WHERE type='table' AND name='comments'`
		)

		if (checkTableExists.rows.length > 0) {
			console.log('Comments table already exists')
			return { success: true, message: 'Comments table already exists' }
		}

		await db.run(
			sql`CREATE TABLE IF NOT EXISTS comments (
                id TEXT PRIMARY KEY NOT NULL,
                content TEXT NOT NULL,
                post_id TEXT NOT NULL,
                author_id TEXT NOT NULL,
                parent_id TEXT,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL,
                FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
                FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
            )`
		)

		console.log('Comments table created successfully')
		return { success: true, message: 'Comments table created successfully' }
	} catch (error) {
		console.error('Error creating comments table:', error)
		return { success: false, error: String(error) }
	}
}
