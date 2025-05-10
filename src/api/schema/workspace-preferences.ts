import { integer, pgTable, timestamp, jsonb } from 'drizzle-orm/pg-core'
import { workspaces, users } from '.'

export const workspacePreferences = pgTable('workspace_preferences', {
  userId: integer('user_id').notNull().references(() => users.id),
  workspaceId: integer('workspace_id').notNull().references(() => workspaces.id),
  preferences: jsonb('preferences').notNull().default({}),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})