import { users } from '@/features/users/schemas/db/user.schema'
import { createId } from '@paralleldrive/cuid2'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const sessions = sqliteTable('sessions', {
  id: text('id').$defaultFn(() => createId()).primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: text('expires_at').notNull(),
  lastUsed: text('last_used')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address')
})

export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert
