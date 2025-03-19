import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { users } from './users'
import { posts } from './posts'

export const comments = sqliteTable('comments', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => createId()),
    content: text('content').notNull(),
    postId: text('post_id')
        .notNull()
        .references(() => posts.id, { onDelete: 'cascade' }),
    authorId: text('author_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    parentId: text('parent_id')
        .references(() => comments.id, { onDelete: 'cascade' }),
    createdAt: integer('created_at', { mode: 'timestamp' })
        .$defaultFn(() => new Date())
        .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
        .$defaultFn(() => new Date())
        .notNull(),
})

// Define relationships
export const commentsRelations = relations(comments, ({ one, many }) => ({
    author: one(users, {
        fields: [comments.authorId],
        references: [users.id],
    }),
    post: one(posts, {
        fields: [comments.postId],
        references: [posts.id],
    }),
    parent: one(comments, {
        fields: [comments.parentId],
        references: [comments.id],
    }),
    replies: many(comments, {
        relationName: 'comment_replies',
    }),
}))

// Update post relations to include comments
export const extendedPostsRelations = relations(posts, ({ one, many }) => ({
    author: one(users, {
        fields: [posts.authorId],
        references: [users.id],
    }),
    comments: many(comments),
}))

export type Comment = typeof comments.$inferSelect
export type NewComment = typeof comments.$inferInsert 