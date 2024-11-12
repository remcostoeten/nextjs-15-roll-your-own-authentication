import { createId } from '@paralleldrive/cuid2'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { users } from './user.schema'

export const userProfiles = sqliteTable('user_profiles', {
  id: text('id').$defaultFn(() => createId()).primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  displayName: text('display_name'),
  avatar: text('avatar'),
  bio: text('bio'),
  location: text('location'),
  website: text('website'),
  timezone: text('timezone'),
  language: text('language').default('en'),
  theme: text('theme', { enum: ['light', 'dark', 'system'] }).default('system'),
  updatedAt: text('updated_at').$defaultFn(() => new Date().toISOString()),
})

export type UserProfile = typeof userProfiles.$inferSelect
export type NewUserProfile = typeof userProfiles.$inferInsert
