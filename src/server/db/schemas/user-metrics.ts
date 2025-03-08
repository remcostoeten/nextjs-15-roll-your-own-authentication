import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { users } from './users'

export const userMetrics = sqliteTable('user_metrics', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => createId()),
	userId: text('user_id')
		.references(() => users.id)
		.notNull()
		.unique(),
	loginStreak: integer('login_streak').default(0),
	lastLogin: integer('last_login', { mode: 'timestamp' }),
	loginCount: integer('login_count').default(0),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
})

export const userMetricsRelations = relations(userMetrics, ({ one }) => ({
	user: one(users, {
		fields: [userMetrics.userId],
		references: [users.id],
	}),
}))

export type UserMetrics = typeof userMetrics.$inferSelect
export type NewUserMetrics = typeof userMetrics.$inferInsert
