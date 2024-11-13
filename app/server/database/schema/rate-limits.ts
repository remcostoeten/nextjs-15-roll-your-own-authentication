import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const rateLimits = pgTable('rate_limits', {
	id: text('id').primaryKey(), // This will be the IP or identifier
	attempts: integer('attempts').notNull().default(0),
	lastAttempt: timestamp('last_attempt').notNull().defaultNow(),
	blockedUntil: timestamp('blocked_until'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
})
