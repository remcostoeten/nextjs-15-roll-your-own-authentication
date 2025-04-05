import { relations } from "drizzle-orm"
import { pgTable, varchar, text, timestamp, boolean, uuid, jsonb } from "drizzle-orm/pg-core"

// Users table
export const users = pgTable("users", {
  id: varchar("id", { length: 128 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  role: varchar("role", { length: 20 }), // Keep this for backward compatibility
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Sessions table
export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey(),
  userId: varchar("user_id", { length: 128 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastUsedAt: timestamp("last_used_at").defaultNow().notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
})

// OAuth accounts table
export const oauthAccounts = pgTable("oauth_accounts", {
  id: varchar("id", { length: 128 }).primaryKey(),
  userId: varchar("user_id", { length: 128 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  providerId: varchar("provider_id", { length: 255 }).notNull(),
  providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Workspaces table
export const workspaces = pgTable("workspaces", {
  id: varchar("id", { length: 128 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  logo: varchar("logo", { length: 255 }),
  createdById: varchar("created_by_id", { length: 128 })
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
})

// Workspace members table
export const workspaceMembers = pgTable("workspace_members", {
  id: varchar("id", { length: 128 }).primaryKey(),
  workspaceId: varchar("workspace_id", { length: 128 })
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 128 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 20 }).default("member").notNull(), // owner, admin, member
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  invitedBy: varchar("invited_by", { length: 128 }).references(() => users.id),
})

// Tasks table
export const tasks = pgTable("tasks", {
  id: varchar("id", { length: 128 }).primaryKey(),
  workspaceId: varchar("workspace_id", { length: 128 })
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 50 }).default("todo").notNull(), // todo, in-progress, done
  priority: varchar("priority", { length: 20 }).default("medium").notNull(), // low, medium, high
  dueDate: timestamp("due_date"),
  assignedToId: varchar("assigned_to_id", { length: 128 }).references(() => users.id),
  createdById: varchar("created_by_id", { length: 128 })
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
})

// Notifications table
export const notifications = pgTable("notifications", {
  id: varchar("id", { length: 128 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  type: varchar("type", { length: 50 }).default("info").notNull(), // info, success, warning, error
  createdById: varchar("created_by_id", { length: 128 })
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
  link: varchar("link", { length: 255 }),
  isGlobal: boolean("is_global").default(false).notNull(),
  metadata: jsonb("metadata"),
  workspaceId: varchar("workspace_id", { length: 128 }).references(() => workspaces.id, { onDelete: "cascade" }),
})

// User notifications table (for tracking read status and targeting specific users)
export const userNotifications = pgTable("user_notifications", {
  id: varchar("id", { length: 128 }).primaryKey(),
  userId: varchar("user_id", { length: 128 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  notificationId: varchar("notification_id", { length: 128 })
    .notNull()
    .references(() => notifications.id, { onDelete: "cascade" }),
  isRead: boolean("is_read").default(false).notNull(),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  notifications: many(userNotifications),
  createdNotifications: many(notifications, { relationName: "creator" }),
  workspaces: many(workspaceMembers, { relationName: "member" }), // Add relation name
  invitedWorkspaceMembers: many(workspaceMembers, { relationName: "inviter" }), // Add relation name
  createdWorkspaces: many(workspaces, { relationName: "creator" }),
  assignedTasks: many(tasks, { relationName: "assignee" }),
  createdTasks: many(tasks, { relationName: "creator" }),
  oauthAccounts: many(oauthAccounts),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export const notificationsRelations = relations(notifications, ({ one, many }) => ({
  creator: one(users, {
    fields: [notifications.createdById],
    references: [users.id],
    relationName: "creator",
  }),
  userNotifications: many(userNotifications),
  workspace: one(workspaces, {
    fields: [notifications.workspaceId],
    references: [workspaces.id],
  }),
}))

export const userNotificationsRelations = relations(userNotifications, ({ one }) => ({
  user: one(users, {
    fields: [userNotifications.userId],
    references: [users.id],
  }),
  notification: one(notifications, {
    fields: [userNotifications.notificationId],
    references: [notifications.id],
  }),
}))

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  creator: one(users, {
    fields: [workspaces.createdById],
    references: [users.id],
    relationName: "creator",
  }),
  members: many(workspaceMembers),
  tasks: many(tasks),
  notifications: many(notifications),
}))

export const workspaceMembersRelations = relations(workspaceMembers, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [workspaceMembers.workspaceId],
    references: [workspaces.id],
  }),
  user: one(users, {
    fields: [workspaceMembers.userId],
    references: [users.id],
    relationName: "member", // Add relation name
  }),
  inviter: one(users, {
    fields: [workspaceMembers.invitedBy],
    references: [users.id],
    relationName: "inviter", // Add relation name
  }),
}))

export const tasksRelations = relations(tasks, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [tasks.workspaceId],
    references: [workspaces.id],
  }),
  assignee: one(users, {
    fields: [tasks.assignedToId],
    references: [users.id],
    relationName: "assignee",
  }),
  creator: one(users, {
    fields: [tasks.createdById],
    references: [users.id],
    relationName: "creator",
  }),
}))

export const oauthAccountsRelations = relations(oauthAccounts, ({ one }) => ({
  user: one(users, {
    fields: [oauthAccounts.userId],
    references: [users.id],
  }),
}))