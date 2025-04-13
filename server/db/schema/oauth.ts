import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { users } from '../schema/users'

export const oauthStates = pgTable('oauth_states', {
	id: uuid('id').defaultRandom().primaryKey(),
	state: text('state').notNull(),
	userId: uuid('user_id')
		.references(() => users.id)
		.notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
})
