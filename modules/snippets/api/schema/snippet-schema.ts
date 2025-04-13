import { relations } from 'drizzle-orm'
import {
	pgTable,
	varchar,
	text,
	timestamp,
	boolean,
	integer,
} from 'drizzle-orm/pg-core'
import { users, workspaces } from 'schema'

// Snippets table
export const snippets = pgTable('snippets', {
	id: varchar('id', { length: 128 }).primaryKey(),
	title: varchar('title', { length: 255 }).notNull(),
	content: text('content').notNull(),
	language: varchar('language', { length: 50 }).default('plain').notNull(),
	categoryId: varchar('category_id', { length: 128 }).references(
		() => categories.id,
		{ onDelete: 'set null' }
	),
	workspaceId: integer('workspace_id')
		.notNull()
		.references(() => workspaces.id, { onDelete: 'cascade' }),
	createdById: varchar('created_by_id', { length: 128 })
		.notNull()
		.references(() => users.id),
	isPublic: boolean('is_public').default(false).notNull(),
	shareId: varchar('share_id', { length: 128 }).unique(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Categories table
export const categories = pgTable('categories', {
	id: varchar('id', { length: 128 }).primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	workspaceId: integer('workspace_id')
		.notNull()
		.references(() => workspaces.id, { onDelete: 'cascade' }),
	createdById: varchar('created_by_id', { length: 128 })
		.notNull()
		.references(() => users.id),
	createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Labels table
export const labels = pgTable('labels', {
	id: varchar('id', { length: 128 }).primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	color: varchar('color', { length: 50 }).default('#6366F1').notNull(),
	workspaceId: integer('workspace_id')
		.notNull()
		.references(() => workspaces.id, { onDelete: 'cascade' }),
	createdById: varchar('created_by_id', { length: 128 })
		.notNull()
		.references(() => users.id),
	createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Snippet-Label junction table
export const snippetLabels = pgTable('snippet_labels', {
	id: varchar('id', { length: 128 }).primaryKey(),
	snippetId: varchar('snippet_id', { length: 128 })
		.notNull()
		.references(() => snippets.id, { onDelete: 'cascade' }),
	labelId: varchar('label_id', { length: 128 })
		.notNull()
		.references(() => labels.id, { onDelete: 'cascade' }),
})

// Define relations
export const snippetsRelations = relations(snippets, ({ one, many }) => ({
	category: one(categories, {
		fields: [snippets.categoryId],
		references: [categories.id],
	}),
	workspace: one(workspaces, {
		fields: [snippets.workspaceId],
		references: [workspaces.id],
	}),
	creator: one(users, {
		fields: [snippets.createdById],
		references: [users.id],
	}),
	labels: many(snippetLabels),
}))

export const categoriesRelations = relations(categories, ({ one, many }) => ({
	workspace: one(workspaces, {
		fields: [categories.workspaceId],
		references: [workspaces.id],
	}),
	creator: one(users, {
		fields: [categories.createdById],
		references: [users.id],
	}),
	snippets: many(snippets),
}))

export const labelsRelations = relations(labels, ({ one, many }) => ({
	workspace: one(workspaces, {
		fields: [labels.workspaceId],
		references: [workspaces.id],
	}),
	creator: one(users, {
		fields: [labels.createdById],
		references: [users.id],
	}),
	snippets: many(snippetLabels),
}))

export const snippetLabelsRelations = relations(snippetLabels, ({ one }) => ({
	snippet: one(snippets, {
		fields: [snippetLabels.snippetId],
		references: [snippets.id],
	}),
	label: one(labels, {
		fields: [snippetLabels.labelId],
		references: [labels.id],
	}),
}))
