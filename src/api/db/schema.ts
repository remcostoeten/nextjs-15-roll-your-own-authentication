// @ts-nocheck
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const UserRole = {
	ADMIN: 'admin',
	USER: 'user',
} as const;

export type TUserRole = (typeof UserRole)[keyof typeof UserRole];

export const users = pgTable('users', {
	id: uuid('id').defaultRandom().primaryKey(),
	email: text('email').notNull().unique(),
	password: text('password'),  // Make password optional for OAuth users
	role: text('role', { enum: ['admin', 'user'] }).notNull().default('user'),
	name: text('name'),
	avatar: text('avatar'),
	emailVerified: timestamp('email_verified_at'),
	lastLoginAt: timestamp('last_login_at'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
	id: uuid('id').defaultRandom().primaryKey(),
	userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const oauthAccounts = pgTable('oauth_accounts', {
	id: uuid('id').defaultRandom().primaryKey(),
	userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	provider: text('provider').notNull(),
	providerAccountId: text('provider_account_id').notNull(),
	accessToken: text('access_token').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Create a unique constraint to prevent multiple accounts from the same provider
export const oauthAccountsProviderKey = pgTable('oauth_accounts_provider_key', {
	provider: text('provider').notNull(),
	providerAccountId: text('provider_account_id').notNull(),
	userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
});
