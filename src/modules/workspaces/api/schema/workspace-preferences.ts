import { pgTable, serial, integer, json, timestamp, foreignKey, unique } from 'drizzle-orm/pg-core';
import { users } from '@/modules/auth/api/schemas';
import { workspaces } from './workspace-schema';
import { relations } from 'drizzle-orm';

export const workspacePreferences = pgTable('workspace_preferences', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  workspaceId: integer('workspace_id').notNull().references(() => workspaces.id),
  preferences: json('preferences').notNull().default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userWorkspaceUnique: unique().on(table.userId, table.workspaceId),
}));

export const workspacePreferencesRelations = relations(workspacePreferences, ({ one }) => ({
  user: one(users, {
    fields: [workspacePreferences.userId],
    references: [users.id],
  }),
  workspace: one(workspaces, {
    fields: [workspacePreferences.workspaceId],
    references: [workspaces.id],
  }),
})); 