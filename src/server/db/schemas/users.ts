import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';

export const users = sqliteTable('users', {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    firstName: text('first_name'),
    lastName: text('last_name'),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert; 