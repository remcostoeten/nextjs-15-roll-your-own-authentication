import { relations } from 'drizzle-orm'
import {
	pgTable,
	varchar,
	text,
	timestamp,
	primaryKey,
} from 'drizzle-orm/pg-core'

export const snippets = pgTable('snippets', {
	id: varchar('id', { length: 128 }).primaryKey(),
	title: varchar('title', { length: 256 }).notNull(),
	content: text('content').notNull(),
	categoryId: varchar('category_id', { length: 128 }),
	createdById: varchar('createdc_by_id', { length: 128 }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const categories = pgTable('categories', {
	id: varchar('id', { length: 128 }).primaryKey(),
	name: varchar('name', { length: 256 }).notNull(),
	createdById: varchar('created_by_id', { length: 128 }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const labels = pgTable('labels', {
	id: varchar('id', { length: 128 }).primaryKey(),
	name: varchar('name', { length: 256 }).notNull(),
	createdById: varchar('created_by_id', { length: 128 }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const snippetLabels = pgTable(
	'snippet_labels',
	{
		snippetId: varchar('snippet_id', { length: 128 }).notNull(),
		labelId: varchar('label_id', { length: 128 }).notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
	},
	(table) => {
		return {
			pk: primaryKey(table.snippetId, table.labelId),
		}
	}
)

export const snippetsRelations = relations(snippets, ({ one, many }) => ({
	category: one(categories, {
		fields: [snippets.categoryId],
		references: [categories.id],
	}),
	labels: many(snippetLabels),
	creator: one(users, {
		fields: [snippets.createdById],
		references: [users.id],
		relationName: 'creator',
	}),
}))

export const categoriesRelations = relations(categories, ({ one, many }) => ({
	snippets: many(snippets),
	creator: one(users, {
		fields: [categories.createdById],
		references: [users.id],
		relationName: 'creator',
	}),
}))

export const labelsRelations = relations(labels, ({ many }) => ({
	snippets: many(snippetLabels),
	creator: one(users, {
		fields: [labels.createdById],
		references: [users.id],
		relationName: 'creator',
	}),
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
