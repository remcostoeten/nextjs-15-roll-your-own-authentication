// @ts-nocheck
import {
  pgTable,
  uuid,
  text,
  jsonb,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";




// === notes ===
export const notes = pgTable("notes", {
  id: uuid("id").primaryKey(),
  workspaceId: uuid("workspace_id"),
  title: text("title"),
  content: jsonb("content"),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

// === note_mentions ===
export const noteMentions = pgTable("note_mentions", {
  id: uuid("id").primaryKey(),
  noteId: uuid("note_id"),
  mentionType: text("mention_type"),
  mentionId: uuid("mention_id"),
  createdAt: timestamp("created_at", { withTimezone: true }),
});

// === sessions ===
export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }),
});

// === ticket_comments ===
export const ticketComments = pgTable("ticket_comments", {
  id: uuid("id").primaryKey(),
  ticketId: uuid("ticket_id"),
  userId: uuid("user_id"),
  content: text("content"),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

// === ticket_history ===
export const ticketHistory = pgTable("ticket_history", {
  id: uuid("id").primaryKey(),
  ticketId: uuid("ticket_id"),
  userId: uuid("user_id"),
  field: text("field"),
  oldValue: text("old_value"),
  newValue: text("new_value"),
  createdAt: timestamp("created_at", { withTimezone: true }),
});

// === ticket_relationships ===
export const ticketRelationships = pgTable("ticket_relationships", {
  id: uuid("id").primaryKey(),
  sourceTicketId: uuid("source_ticket_id"),
  targetTicketId: uuid("target_ticket_id"),
  type: text("type"),
  createdAt: timestamp("created_at", { withTimezone: true }),
});

// === tickets ===
export const tickets = pgTable("tickets", {
  id: uuid("id").primaryKey(),
  workspaceId: uuid("workspace_id"),
  title: text("title"),
  description: text("description"),
  status: text("status"),
  priority: text("priority"),
  assigneeId: uuid("assignee_id"),
  reporterId: uuid("reporter_id"),
  dueDate: timestamp("due_date", { withTimezone: true }),
  estimatedHours: integer("estimated_hours"),
  labels: jsonb("labels"),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

// === users_table ===
export const users = pgTable("users_table", {
  id: uuid("id").primaryKey(),
  email: text("email"),
  password: text("password"),
  role: text("role"),
  name: text("name"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
});
