'use server';

import { db } from '@/api/connection';
import { hash } from 'bcrypt';
import { sql } from 'drizzle-orm';
import { users } from '../schema';

export async function migrateUsers() {
	try {
		// Get all users from the old table
		const oldUsers = await db.select().from(users);

		// Insert users into the new table
		for (const user of oldUsers) {
			await db.insert(users).values({
				id: user.id,
				name: user.name,
				email: user.email,
				password: await hash('temporary-password', 10), // Set a temporary password that needs to be changed
				avatar: user.avatar,
				role: user.role,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			});
		}

		// Update sessions to reference the new users table
		await db.execute(sql`
			ALTER TABLE sessions
			DROP CONSTRAINT IF EXISTS sessions_user_id_users_id_fk,
			ADD CONSTRAINT sessions_user_id_users_table_id_fk
			FOREIGN KEY (user_id)
			REFERENCES users_table(id)
			ON DELETE CASCADE;
		`);

		console.log('Migration completed successfully');
	} catch (error) {
		console.error('Migration failed:', error);
		throw error;
	}
}
