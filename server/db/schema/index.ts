import { relations } from 'drizzle-orm'
import {
	pgTable,
	varchar,
	text,
	timestamp,
	boolean,
	uuid,
	jsonb,
	integer,
	serial,
	primaryKey,
} from 'drizzle-orm/pg-core'

import {
	chats,
	messages,
	favorites,
	chatMembers,
} from '@/server/db/schema-chats'

import {
	snippets,
	categories,
	labels,
	snippetLabels,
	snippetsRelations,
	categoriesRelations,
	labelsRelations,
	snippetLabelsRelations,
} from '@/modules/snippets/db/schema'

// Schemas for users and authentication
export const users = pgTable('users', {
	id: varchar('id', { length: 128 }).primaryKey(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	username: varchar('username', { length: 255 }).notNull().unique(),
	firstName: varchar('first_name', { length: 255 }).notNull(),
	lastName: varchar('last_name', { length: 255 }).notNull(),
	password: varchar('password', { length: 255 }).notNull(),
	phone: varchar('phone', { length: 20 }),
	avatar: varchar('avatar', { length: 255 }),
	role: varchar('role', { length: 20 }),
	isAdmin: boolean('is_admin').default(false).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const sessions = pgTable('sessions', {
	id: uuid('id').primaryKey(),
	userId: varchar('user_id', { length: 128 })
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	lastUsedAt: timestamp('last_used_at').defaultNow().notNull(),
	ipAddress: varchar('ip_address', { length: 45 }),
	userAgent: text('user_agent'),
})

export const oauthAccounts = pgTable('oauth_accounts', {
	id: varchar('id', { length: 128 }).primaryKey(),
	userId: varchar('user_id', { length: 128 })
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	providerId: varchar('provider_id', { length: 255 }).notNull(),
	providerAccountId: varchar('provider_account_id', {
		length: 255,
	}).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Workspaces
export const workspaces = pgTable('workspaces', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 256 }).notNull(),
	slug: varchar('slug', { length: 256 }).notNull().unique(),
	description: text('description'),
	logo: varchar('logo', { length: 256 }),
	createdById: varchar('created_by_id', { length: 128 })
		.notNull()
		.references(() => users.id),
	isActive: boolean('is_active').default(true).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const workspaceMembers = pgTable('workspace_members', {
	id: serial('id').primaryKey(),
	workspaceId: integer('workspace_id')
		.notNull()
		.references(() => workspaces.id, { onDelete: 'cascade' }),
	userId: varchar('user_id', { length: 128 })
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	role: varchar('role', { length: 20 }).default('member').notNull(),
	joinedAt: timestamp('joined_at').defaultNow().notNull(),
	invitedBy: varchar('invited_by', { length: 128 }).references(
		() => users.id
	),
})

export const workspaceActivities = pgTable('workspace_activities', {
	id: varchar('id', { length: 128 }).primaryKey(),
	workspaceId: integer('workspace_id')
		.notNull()
		.references(() => workspaces.id, { onDelete: 'cascade' }),
	userId: varchar('user_id', { length: 128 })
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	type: varchar('type', { length: 50 }).notNull(),
	content: text('content').notNull(),
	metadata: jsonb('metadata'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Tasks
export const tasks = pgTable('tasks', {
	id: serial('id').primaryKey(),
	workspaceId: integer('workspace_id')
		.notNull()
		.references(() => workspaces.id, { onDelete: 'cascade' }),
	title: varchar('title', { length: 256 }).notNull(),
	description: text('description'),
	status: varchar('status', { length: 50 }).notNull().default('todo'),
	priority: varchar('priority', { length: 50 }).notNull().default('medium'),
	dueDate: timestamp('due_date'),
	assignedToId: varchar('assigned_to_id', { length: 128 }).references(
		() => users.id
	),
	createdById: varchar('created_by_id', { length: 128 })
		.notNull()
		.references(() => users.id),
	completedAt: timestamp('completed_at'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Notifications
export const notifications = pgTable('notifications', {
	id: varchar('id', { length: 128 }).primaryKey(),
	title: varchar('title', { length: 255 }).notNull(),
	content: text('content').notNull(),
	type: varchar('type', { length: 50 }).default('info').notNull(),
	createdById: varchar('created_by_id', { length: 128 })
		.notNull()
		.references(() => users.id),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	expiresAt: timestamp('expires_at'),
	link: varchar('link', { length: 255 }),
	isGlobal: boolean('is_global').default(false).notNull(),
	metadata: jsonb('metadata'),
	workspaceId: integer('workspace_id').references(() => workspaces.id, {
		onDelete: 'cascade',
	}),
})

export const userNotifications = pgTable('user_notifications', {
	id: varchar('id', { length: 128 }).primaryKey(),
	userId: varchar('user_id', { length: 128 })
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	notificationId: varchar('notification_id', { length: 128 })
		.notNull()
		.references(() => notifications.id, { onDelete: 'cascade' }),
	isRead: boolean('is_read').default(false).notNull(),
	readAt: timestamp('read_at'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Snippets and related tables
// Note: Fixed the typo in created_by_id column name
export const snippets = pgTable('snippets', {
	id: varchar('id', { length: 128 }).primaryKey(),
	title: varchar('title', { length: 256 }).notNull(),
	content: text('content').notNull(),
	categoryId: varchar('category_id', { length: 128 }),
	// Fixed the typo from createdc_by_id to created_by_id
	createdById: varchar('created_by_id', { length: 128 }),
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
			pk: primaryKey({ columns: [table.snippetId, table.labelId] }),
		}
	}
)

// Relations definitions

export const usersRelations = relations(users, ({ one, many }) => ({
	// Authentication relations
	sessions: many(sessions),
	oauthAccounts: many(oauthAccounts),

	// Workspace relations
	workspacesMemberships: many(workspaceMembers),
	createdWorkspaces: many(workspaces, { relationName: 'creator' }),
	invitedWorkspaceMembers: many(workspaceMembers, {
		relationName: 'inviter',
	}),

	// Task relations
	assignedTasks: many(tasks, { relationName: 'assignee' }),
	createdTasks: many(tasks, { relationName: 'creator' }),

	// Notification relations
	notifications: many(userNotifications),
	createdNotifications: many(notifications, { relationName: 'creator' }),

	// Activity relations
	activities: many(workspaceActivities),

	// Chat relations
	chatMemberships: many(chatMembers),
	messages: many(messages),
	favorites: many(favorites),
	createdChats: many(chats, { relationName: 'creator' }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}))

export const oauthAccountsRelations = relations(oauthAccounts, ({ one }) => ({
	user: one(users, {
		fields: [oauthAccounts.userId],
		references: [users.id],
	}),
}))

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
	creator: one(users, {
		fields: [workspaces.createdById],
		references: [users.id],
		relationName: 'creator',
	}),
	members: many(workspaceMembers),
	tasks: many(tasks),
	activities: many(workspaceActivities),
	notifications: many(notifications),
	chats: many(chats),
}))

export const workspaceMembersRelations = relations(
	workspaceMembers,
	({ one }) => ({
		workspace: one(workspaces, {
			fields: [workspaceMembers.workspaceId],
			references: [workspaces.id],
		}),
		user: one(users, {
			fields: [workspaceMembers.userId],
			references: [users.id],
			relationName: 'member', // Add this relation name
		}),
		inviter: one(users, {
			fields: [workspaceMembers.invitedBy],
			references: [users.id],
			relationName: 'inviter',
		}),
	})
)

export const workspaceActivitiesRelations = relations(
	workspaceActivities,
	({ one }) => ({
		workspace: one(workspaces, {
			fields: [workspaceActivities.workspaceId],
			references: [workspaces.id],
		}),
		user: one(users, {
			fields: [workspaceActivities.userId],
			references: [users.id],
		}),
	})
)

export const tasksRelations = relations(tasks, ({ one }) => ({
	workspace: one(workspaces, {
		fields: [tasks.workspaceId],
		references: [workspaces.id],
	}),
	assignee: one(users, {
		fields: [tasks.assignedToId],
		references: [users.id],
		relationName: 'assignee',
	}),
	creator: one(users, {
		fields: [tasks.createdById],
		references: [users.id],
		relationName: 'creator',
	}),
}))

export const notificationsRelations = relations(
	notifications,
	({ one, many }) => ({
		creator: one(users, {
			fields: [notifications.createdById],
			references: [users.id],
			relationName: 'creator',
		}),
		userNotifications: many(userNotifications),
		workspace: one(workspaces, {
			fields: [notifications.workspaceId],
			references: [workspaces.id],
		}),
	})
)

export const userNotificationsRelations = relations(
	userNotifications,
	({ one }) => ({
		user: one(users, {
			fields: [userNotifications.userId],
			references: [users.id],
		}),
		notification: one(notifications, {
			fields: [userNotifications.notificationId],
			references: [notifications.id],
		}),
	})
)

// Snippet-related relations
// Note: There's a type mismatch between users.id (integer) and snippets.createdById (varchar)
// You'll need to decide how to handle this - either change the type in the database or handle it in your application

export const snippetsRelations = relations(snippets, ({ one, many }) => ({
	category: one(categories, {
		fields: [snippets.categoryId],
		references: [categories.id],
	}),
	labels: many(snippetLabels),
	// Note: This relation is commented out due to type mismatch
	// creator: one(users, {
	//   fields: [snippets.createdById],
	//   references: [users.id],
	//   relationName: 'creator',
	// }),
}))

export const categoriesRelations = relations(categories, ({ many }) => ({
	snippets: many(snippets),
	// Note: This relation is commented out due to type mismatch
	// creator: one(users, {
	//   fields: [categories.createdById],
	//   references: [users.id],
	//   relationName: 'creator',
	// }),
}))

export const labelsRelations = relations(labels, ({ many }) => ({
	snippets: many(snippetLabels),
	// Note: This relation is commented out due to type mismatch
	// creator: one(users, {
	//   fields: [labels.createdById],
	//   references: [users.id],
	//   relationName: 'creator',
	// }),
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

// Export chat schema
export { chats, messages, favorites, chatMembers }
