"use server"

import { db } from "@/server/db"
import { workspaces, workspaceMembers, users, tasks } from "@/server/db/schema"
import { eq, and, desc, count } from "drizzle-orm"
import { getCurrentUser } from "@/modules/authentication/utilities/auth"

// Get user workspaces
export async function getUserWorkspaces() {
  const user = await getCurrentUser()

  if (!user) {
    return []
  }

  const userWorkspaces = await db
    .select({
      id: workspaces.id,
      name: workspaces.name,
      slug: workspaces.slug,
      description: workspaces.description,
      logo: workspaces.logo,
      createdAt: workspaces.createdAt,
      role: workspaceMembers.role,
      isActive: workspaces.isActive,
    })
    .from(workspaceMembers)
    .innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
    .where(and(eq(workspaceMembers.userId, user.id), eq(workspaces.isActive, true)))
    .orderBy(desc(workspaces.createdAt))

  return userWorkspaces
}

// Get workspace by slug
export async function getWorkspaceBySlug(slug: string) {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const [workspace] = await db
    .select({
      id: workspaces.id,
      name: workspaces.name,
      slug: workspaces.slug,
      description: workspaces.description,
      logo: workspaces.logo,
      createdAt: workspaces.createdAt,
      createdBy: {
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
      },
      role: workspaceMembers.role,
    })
    .from(workspaces)
    .innerJoin(workspaceMembers, eq(workspaceMembers.workspaceId, workspaces.id))
    .innerJoin(users, eq(workspaces.createdById, users.id))
    .where(and(eq(workspaces.slug, slug), eq(workspaceMembers.userId, user.id), eq(workspaces.isActive, true)))

  if (!workspace) {
    return null
  }

  // Get member count
  const [memberCount] = await db
    .select({ count: count() })
    .from(workspaceMembers)
    .where(eq(workspaceMembers.workspaceId, workspace.id))

  // Get task count
  const [taskCount] = await db.select({ count: count() }).from(tasks).where(eq(tasks.workspaceId, workspace.id))

  return {
    ...workspace,
    memberCount: memberCount?.count || 0,
    taskCount: taskCount?.count || 0,
  }
}

// Get workspace members
export async function getWorkspaceMembers(workspaceId: number) {
  const user = await getCurrentUser()

  if (!user) {
    return []
  }

  // Check if user is a member of this workspace
  const userMembership = await db
    .select()
    .from(workspaceMembers)
    .where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, user.id)))
    .limit(1)

  if (userMembership.length === 0) {
    return []
  }

  const members = await db
    .select({
      id: workspaceMembers.id,
      role: workspaceMembers.role,
      joinedAt: workspaceMembers.joinedAt,
      user: {
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        username: users.username,
      },
    })
    .from(workspaceMembers)
    .innerJoin(users, eq(workspaceMembers.userId, users.id))
    .where(eq(workspaceMembers.workspaceId, workspaceId))
    .orderBy(workspaceMembers.role, users.firstName, users.lastName)

  return members
}

// Get workspace tasks
export async function getWorkspaceTasks(workspaceId: number) {
  const user = await getCurrentUser()

  if (!user) {
    return []
  }

  // Check if user is a member of this workspace
  const userMembership = await db
    .select()
    .from(workspaceMembers)
    .where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, user.id)))
    .limit(1)

  if (userMembership.length === 0) {
    return []
  }

  const workspaceTasks = await db
    .select({
      id: tasks.id,
      title: tasks.title,
      description: tasks.description,
      status: tasks.status,
      priority: tasks.priority,
      dueDate: tasks.dueDate,
      createdAt: tasks.createdAt,
      updatedAt: tasks.updatedAt,
      completedAt: tasks.completedAt,
      assignee: {
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
      },
    })
    .from(tasks)
    .leftJoin(users, eq(tasks.assignedToId, users.id))
    .where(eq(tasks.workspaceId, workspaceId))
    .orderBy(tasks.createdAt)

  return workspaceTasks
}

