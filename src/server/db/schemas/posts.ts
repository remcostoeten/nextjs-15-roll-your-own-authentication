import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const posts = sqliteTable('posts', {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    title: text('title').notNull(),
    content: text('content').notNull(),
    published: integer('published', { mode: 'boolean' }).notNull().default(false),
    sensitive: integer('sensitive', { mode: 'boolean' }).notNull().default(false),
    authorId: text('author_id').references(() => users.id).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

// Define relationships
export const postsRelations = relations(posts, ({ one }) => ({
    author: one(users, {
        fields: [posts.authorId],
        references: [users.id],
    }),
}));

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert; 