import { posts } from "@/server/db/schemas/posts";
import { users } from "@/server/db/schemas/users";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import type { InferModel } from 'drizzle-orm';

export const comments = sqliteTable('comments', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  postId: text('post_id').references(() => posts.id),
  authorId: text('author_id').references(() => users.id),
  parentId: text('parent_id').references(() => comments.id),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export type Comment = InferModel<typeof comments>;
