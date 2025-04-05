#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Print styled messages
info() {
  echo -e "${BLUE}INFO:${NC} $1"
}

success() {
  echo -e "${GREEN}SUCCESS:${NC} $1"
}

warning() {
  echo -e "${YELLOW}WARNING:${NC} $1"
}

error() {
  echo -e "${RED}ERROR:${NC} $1"
}

# Check if PostgreSQL is running in Docker
check_postgres() {
  if command -v docker &> /dev/null; then
    if docker ps | grep -q postgres; then
      return 0
    fi
  fi
  return 1
}

# Get PostgreSQL version
get_postgres_version() {
  if check_postgres; then
    container_id=$(docker ps | grep postgres | awk '{print $1}')
    version=$(docker exec $container_id psql -V | grep -oP '(?<=psql $$PostgreSQL$$ )[0-9.]+')
    echo $version
  else
    echo "unknown"
  fi
}

# Main script
echo "========================================="
echo "  Fix for 'type serial does not exist'"
echo "========================================="
echo ""

# Check PostgreSQL version
if check_postgres; then
  version=$(get_postgres_version)
  info "PostgreSQL version: $version"
else
  warning "PostgreSQL is not running in Docker"
  info "Make sure your PostgreSQL server is running"
fi

# Check if schema file exists
schema_file="server/db/schema/index.ts"
if [ ! -f "$schema_file" ]; then
  error "Schema file not found at $schema_file"
  exit 1
fi

# Make a backup of the schema file
cp "$schema_file" "${schema_file}.bak"
success "Created backup of schema file at ${schema_file}.bak"

# Check if @paralleldrive/cuid2 is installed
if ! grep -q "@paralleldrive/cuid2" package.json; then
  info "Installing @paralleldrive/cuid2..."
  npm install @paralleldrive/cuid2
  success "Installed @paralleldrive/cuid2"
fi

# Update the schema file
info "Updating schema file to use text IDs instead of serial..."
cat > "$schema_file" << 'EOF'
import { relations } from "drizzle-orm"
import { pgTable, text, boolean, timestamp, integer } from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"

// Users table
export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  username: text("username").unique().notNull(),
  email: text("email").unique().notNull(),
  password: text("password"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// User relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  oauthAccounts: many(oauthAccounts),
  workspaceMembers: many(workspaceMembers),
  notifications: many(notifications),
  activities: many(activities),
}))

// Sessions table
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Session relations
export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

// OAuth accounts table
export const oauthAccounts = pgTable("oauth_accounts", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// OAuth account relations
export const oauthAccountsRelations = relations(oauthAccounts, ({ one }) => ({
  user: one(users, {
    fields: [oauthAccounts.userId],
    references: [users.id],
  }),
}))

// Workspaces table
export const workspaces = pgTable("workspaces", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Workspace relations
export const workspacesRelations = relations(workspaces, ({ many }) => ({
  members: many(workspaceMembers),
  tasks: many(tasks),
}))

// Workspace members table
export const workspaceMembers = pgTable("workspace_members", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  workspaceId: text("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("member"),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  invitedBy: text("invited_by").references(() => users.id),
})

// Workspace member relations
export const workspaceMembersRelations = relations(workspaceMembers, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [workspaceMembers.workspaceId],
    references: [workspaces.id],
  }),
  user: one(users, {
    fields: [workspaceMembers.userId],
    references: [users.id],
  }),
  inviter: one(users, {
    fields: [workspaceMembers.invitedBy],
    references: [users.id],
  }),
}))

// Tasks table
export const tasks = pgTable("tasks", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  workspaceId: text("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("todo"),
  assignedToId: text("assigned_to_id").references(() => users.id),
  createdById: text("created_by_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Task relations
export const tasksRelations = relations(tasks, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [tasks.workspaceId],
    references: [workspaces.id],
  }),
  assignedTo: one(users, {
    fields: [tasks.assignedToId],
    references: [users.id],
  }),
  createdBy: one(users, {
    fields: [tasks.createdById],
    references: [users.id],
  }),
}))

// Notifications table
export const notifications = pgTable("notifications", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  type: text("type").notNull().default("info"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Notification relations
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}))

// Activities table
export const activities = pgTable("activities", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Activity relations
export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, {
    fields: [activities.userId],
    references: [users.id],
  }),
}))
EOF

success "Updated schema file to use text IDs with cuid2"

# Clean up any existing migrations
if [ -d "drizzle" ]; then
  info "Cleaning up existing migrations..."
  rm -rf drizzle
  mkdir -p drizzle
  success "Cleaned up existing migrations"
fi

# Regenerate migrations
info "Regenerating migrations..."
npx drizzle-kit generate
if [ $? -eq 0 ]; then
  success "Successfully regenerated migrations"
else
  error "Failed to regenerate migrations"
fi

echo ""
info "Now try pushing the schema to the database:"
echo "npx drizzle-kit push"
echo ""
info "If you encounter any issues, you can restore the backup:"
echo "cp ${schema_file}.bak ${schema_file}"
echo ""

