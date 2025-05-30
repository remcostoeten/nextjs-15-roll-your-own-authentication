// @ts-nocheck
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const oauthAccounts = pgTable('oauth_accounts', {
	id: uuid('id').defaultRandom().primaryKey(),
	userId: text('user_id').notNull(),
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
	userId: text('user_id').notNull(),
});
