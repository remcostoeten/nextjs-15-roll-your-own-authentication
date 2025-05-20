'use server';

import { db } from '../index';
import { users } from '../schema';

export async function migrateUsers() {
  try {
    // Get all users from the old table
    const oldUsers = await db.query('SELECT * FROM users');

    // Insert users into the new table
    for (const user of oldUsers) {
      await db.insert(users).values({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      });
    }

    // Update sessions to reference the new users table
    await db.query(`
      ALTER TABLE sessions
      DROP CONSTRAINT sessions_user_id_users_id_fk,
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
