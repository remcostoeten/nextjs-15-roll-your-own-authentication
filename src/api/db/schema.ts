// @ts-nocheck
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const UserRole = {
	ADMIN: 'admin',
	USER: 'user',
} as const;

export type TUserRole = (typeof UserRole)[keyof typeof UserRole];

export const users = pgTable('users_table', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	role: text('role', { enum: ['admin', 'user'] })
		.default('user')
		.notNull(),
	name: text('name'),
	avatar: text('avatar'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at'),
	lastLoginAt: timestamp('last_login_at'),
});

export const sessions = pgTable('sessions', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
});
