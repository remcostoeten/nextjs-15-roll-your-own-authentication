import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const roadmapItems = sqliteTable('roadmap_items', {
	id: text('id').primaryKey().notNull(),
	title: text('title').notNull(),
	description: text('description').notNull(),
	status: text('status', { enum: ['planned', 'in-progress', 'completed'] })
		.default('planned')
		.notNull(),
	priority: integer('priority').default(0).notNull(),
	quarter: text('quarter').notNull(),
	votes: integer('votes').default(0).notNull(),
	created_at: text('created_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updated_at: text('updated_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
})
