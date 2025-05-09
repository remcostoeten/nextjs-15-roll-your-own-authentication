import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { userProfiles } from '@/api/schema';

export const workspaces = pgTable('workspaces', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: varchar('description', { length: 255 }).notNull(),
    emoji: varchar('emoji', { length: 255 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
})

export const workspacesRelations = relations(workspaces, ({ many }) => ({
    users: many(userProfiles),
}))
