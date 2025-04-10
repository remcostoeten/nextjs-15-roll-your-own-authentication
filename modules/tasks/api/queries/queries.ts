'use server'

import { db } from '@/server/db'
import { tasks, workspaceMembers, users, workspaces } from '@/server/db/schema'
import { eq, and, desc, or, like } from 'drizzle-orm'
import { getCurrentUser } from '@/modules/authentication/utilities/auth'

export async function getWorkspaceTasks(workspaceId: string) {
	const user = await getCurrentUser()

	if (!user) {
		return []
	}

	// Check if user is a member of this workspace
	const userMembership = await db
		.select()
		.from(workspaceMembers)
		.where(
			and(
				eq(workspaceMembers.workspaceId, workspaceId),
				eq(workspaceMembers.userId, user.id)
			)
		)
		.limit(1)

	if (userMembership.length === 0) {
		return []
	}

	return await db
		.select({
			id: tasks.id,
			title: tasks.title,
			description: tasks.description,
			status: tasks.status,
			priority: tasks.priority,
			dueDate: tasks.dueDate,
			completedAt: tasks.completedAt,
			createdAt: tasks.createdAt,
			updatedAt: tasks.updatedAt,
			assignee: {
				id: users.id,
				firstName: users.firstName,
				lastName: users.lastName,
				avatar: users.avatar,
			},
			creator: {
				id: users.id,
				firstName: users.firstName,
				lastName: users.lastName,
			},
		})
		.from(tasks)
		.leftJoin(users, eq(tasks.assignedToId, users.id))
		.innerJoin(users, eq(tasks.createdById, users.id))
		.where(eq(tasks.workspaceId, workspaceId))
		.orderBy(desc(tasks.createdAt))
}

export async function getTaskById(taskId: string) {
	const user = await getCurrentUser()

	if (!user) {
		return null
	}

	const [task] = await db
		.select({
			id: tasks.id,
			title: tasks.title,
			description: tasks.description,
			status: tasks.status,
			priority: tasks.priority,
			dueDate: tasks.dueDate,
			completedAt: tasks.completedAt,
			createdAt: tasks.createdAt,
			updatedAt: tasks.updatedAt,
			workspaceId: tasks.workspaceId,
			assignee: {
				id: users.id,
				firstName: users.firstName,
				lastName: users.lastName,
				avatar: users.avatar,
			},
			creator: {
				id: users.id,
				firstName: users.firstName,
				lastName: users.lastName,
			},
		})
		.from(tasks)
		.leftJoin(users, eq(tasks.assignedToId, users.id))
		.innerJoin(users, eq(tasks.createdById, users.id))
		.where(eq(tasks.id, taskId))

	if (!task) {
		return null
	}

	// Check if user is a member of this workspace
	const userMembership = await db
		.select()
		.from(workspaceMembers)
		.where(
			and(
				eq(workspaceMembers.workspaceId, task.workspaceId),
				eq(workspaceMembers.userId, user.id)
			)
		)
		.limit(1)

	if (userMembership.length === 0) {
		return null
	}

	return task
}

export async function searchTasks(workspaceId: string, query: string) {
	const user = await getCurrentUser()

	if (!user) {
		return []
	}

	// Check if user is a member of this workspace
	const userMembership = await db
		.select()
		.from(workspaceMembers)
		.where(
			and(
				eq(workspaceMembers.workspaceId, workspaceId),
				eq(workspaceMembers.userId, user.id)
			)
		)
		.limit(1)

	if (userMembership.length === 0) {
		return []
	}

	return await db
		.select({
			id: tasks.id,
			title: tasks.title,
			description: tasks.description,
			status: tasks.status,
			priority: tasks.priority,
			dueDate: tasks.dueDate,
			createdAt: tasks.createdAt,
			updatedAt: tasks.updatedAt,
			workspaceName: workspaces.name,
		})
		.from(tasks)
		.innerJoin(workspaces, eq(tasks.workspaceId, workspaces.id))
		.where(
			and(
				eq(tasks.workspaceId, workspaceId),
				or(
					like(tasks.title, `%${query}%`),
					like(tasks.description, `%${query}%`)
				)
			)
		)
		.orderBy(desc(tasks.updatedAt))
		.limit(10)
}
