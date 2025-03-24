import { sql } from 'drizzle-orm'
import { text, integer, boolean, timestamp, pgTable } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

export const roadmapItems = pgTable('roadmap_items', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => createId()),
	title: text('title').notNull(),
	description: text('description'),
	startDate: timestamp('start_date').notNull(),
	endDate: timestamp('end_date').notNull(),
	isStarted: boolean('is_started').default(false),
	status: text('status').notNull().default('PLANNED'),
	priority: integer('priority').notNull().default(1),
	assigneeId: text('assignee_id').notNull(),
	assigneeName: text('assignee_name').notNull(),
	assigneeAvatar: text('assignee_avatar'),
	estimatedHours: integer('estimated_hours'),
	progress: integer('progress').default(0),
	createdAt: timestamp('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp('updated_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
})

export const roadmapSubtasks = pgTable('roadmap_subtasks', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => createId()),
	roadmapItemId: text('roadmap_item_id')
		.notNull()
		.references(() => roadmapItems.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	isCompleted: boolean('is_completed').default(false),
	createdAt: timestamp('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
})

export const roadmapComments = pgTable('roadmap_comments', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => createId()),
	roadmapItemId: text('roadmap_item_id')
		.notNull()
		.references(() => roadmapItems.id, { onDelete: 'cascade' }),
	content: text('content').notNull(),
	authorId: text('author_id').notNull(),
	authorName: text('author_name').notNull(),
	authorAvatar: text('author_avatar'),
	createdAt: timestamp('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
})
