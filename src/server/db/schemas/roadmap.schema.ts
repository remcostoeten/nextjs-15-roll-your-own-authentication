import { text, integer, timestamp, pgTable } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

export const roadmapItems = pgTable('roadmap_items', {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    title: text('title').notNull(),
    description: text('description').notNull(),
    status: text('status', { enum: ['planned', 'in-progress', 'completed'] }).default('planned').notNull(),
    priority: integer('priority').default(0),
    quarter: text('quarter').notNull(), // e.g., "Q2 2024"
    votes: integer('votes').default(0),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow()
}) 