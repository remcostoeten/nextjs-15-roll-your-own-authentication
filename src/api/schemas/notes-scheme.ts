import { relations } from "drizzle-orm";
import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users, workspaces } from "../db/schema";

// Notes/Snippets table
export const notes = pgTable("notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: jsonb("content").notNull(), // Store rich text content as JSON
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
})
// Note mentions (references to other notes, tickets, or users)
export const noteMentions = pgTable("note_mentions", {
  id: uuid("id").primaryKey().defaultRandom(),
  noteId: uuid("note_id")
    .notNull()
    .references(() => notes.id, { onDelete: "cascade" }),
  mentionType: text("mention_type").notNull(), // 'note', 'ticket', 'user'
  mentionId: uuid("mention_id").notNull(), // ID of the mentioned entity
  createdAt: timestamp("created_at").defaultNow().notNull(),
})


export const notesRelations = relations(notes, ({ one, many }) => ({
  workspace: one (workspaces, {
    fields: [notes.workspaceId],
    references: [workspaces.id],
  }),
  creator: one(users, {
    fields: [notes.createdBy],
    references: [users.id],
  }),
  mentions: many(noteMentions),
}))

export const noteMentionsRelations = relations(noteMentions, ({ one }) => ({
  note: one(notes, {
    fields: [noteMentions.noteId],
    references: [notes.id],
  }),
}))
