import { pgTable, varchar, timestamp } from 'drizzle-orm/pg-core'
import { users } from '@/server/db/schema'
export const oauthStates = pgTable('oauth_states', {
	id: varchar('id', { length: 128 }).primaryKey(),
	state: varchar('state', { length: 255 }).notNull(),
	userId: varchar('user_id', { length: 128 })
		.references(() => users.id)
		.notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
})
