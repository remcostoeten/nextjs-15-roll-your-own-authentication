import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { users } from './users'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const widgetCategories = sqliteTable('widget_categories', {
	id: text('id').primaryKey().notNull(),
	name: text('name').notNull(),
	color: text('color').notNull().default('#3b82f6'),
	userId: text('user_id')
		.references(() => users.id)
		.notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
})

export const insertCategorySchema = createInsertSchema(widgetCategories)
export const selectCategorySchema = createSelectSchema(widgetCategories)

export type WidgetCategory = typeof widgetCategories.$inferSelect
export type NewWidgetCategory = typeof widgetCategories.$inferInsert
