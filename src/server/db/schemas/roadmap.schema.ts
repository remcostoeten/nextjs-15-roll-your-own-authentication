import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'
import { createId } from '@paralleldrive/cuid2'

export const roadmapItems = sqliteTable('roadmap_items', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => createId()),
	title: text('title').notNull(),
	description: text('description').notNull(),
	status: text('status', { enum: ['planned', 'in-progress', 'completed'] })
		.default('planned')
		.notNull(),
	priority: integer('priority').default(0),
	quarter: text('quarter').notNull(), // e.g., "Q2 2024"
	votes: integer('votes').default(0),
	createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
	updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
})
