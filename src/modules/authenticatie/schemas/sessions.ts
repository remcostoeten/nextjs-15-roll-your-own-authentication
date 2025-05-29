// @ts-nocheck
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';

export const sessions = pgTable('sessions', {
	id: uuid('id').defaultRandom().primaryKey(),
	userId: text('user_id').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
