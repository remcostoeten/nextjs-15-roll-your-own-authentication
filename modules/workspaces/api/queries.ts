'use server'

import { db } from '@/server/db'
import {
	workspaces,
	workspaceMembers,
	users,
	tasks,
	workspaceActivities,
} from '@/server/db/schema'
import { eq, and, desc, count, like, or } from 'drizzle-orm'
import { getCurrentUser } from '@/modules/authentication/utilities/auth'

export async function getUserWorkspaces() {
	const user = await getCurrentUser()

	if (!user) {
		return []
	}

	return await db
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
		.where(
			and(
				eq(workspaceMembers.userId, user.id),
				eq(workspaces.isActive, true)
			)
		)
		.orderBy(desc(workspaces.createdAt))
}

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
		.innerJoin(
			workspaceMembers,
			eq(workspaceMembers.workspaceId, workspaces.id)
		)
		.innerJoin(users, eq(workspaces.createdById, users.id))
		.where(
			and(
				eq(workspaces.slug, slug),
				eq(workspaceMembers.userId, user.id),
				eq(workspaces.isActive, true)
			)
		)

	if (!workspace) {
		return null
	}

	const [memberCount] = await db
		.select({ count: count() })
		.from(workspaceMembers)
		.where(eq(workspaceMembers.workspaceId, workspace.id))

	const [taskCount] = await db
		.select({ count: count() })
		.from(tasks)
		.where(eq(tasks.workspaceId, workspace.id))

	return {
		...workspace,
		memberCount: memberCount?.count || 0,
		taskCount: taskCount?.count || 0,
	}
}

export async function getWorkspaceMembers(workspaceId: number) {
	const user = await getCurrentUser()

	if (!user) {
		return []
	}

	return await db
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
				avatar: users.avatar,
			},
		})
		.from(workspaceMembers)
		.innerJoin(users, eq(workspaceMembers.userId, users.id))
		.where(eq(workspaceMembers.workspaceId, workspaceId))
		.orderBy(workspaceMembers.role, users.firstName, users.lastName)
}

export async function getWorkspaceActivities(workspaceId: string, limit = 10) {
	const user = await getCurrentUser()

	if (!user) {
		return []
	}

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
			id: workspaceActivities.id,
			type: workspaceActivities.type,
			content: workspaceActivities.content,
			metadata: workspaceActivities.metadata,
			createdAt: workspaceActivities.createdAt,
			user: {
				id: users.id,
				firstName: users.firstName,
				lastName: users.lastName,
				avatar: users.avatar,
			},
		})
		.from(workspaceActivities)
		.innerJoin(users, eq(workspaceActivities.userId, users.id))
		.where(eq(workspaceActivities.workspaceId, workspaceId))
		.orderBy(desc(workspaceActivities.createdAt))
		.limit(limit)
}

export async function searchWorkspaceMembers(
	workspaceId: string,
	query: string
) {
	const user = await getCurrentUser()

	if (!user) {
		return []
	}

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
			id: users.id,
			firstName: users.firstName,
			lastName: users.lastName,
			email: users.email,
			username: users.username,
			avatar: users.avatar,
		})
		.from(workspaceMembers)
		.innerJoin(users, eq(workspaceMembers.userId, users.id))
		.where(
			and(
				eq(workspaceMembers.workspaceId, workspaceId),
				or(
					like(users.firstName, `%${query}%`),
					like(users.lastName, `%${query}%`),
					like(users.email, `%${query}%`),
					like(users.username, `%${query}%`)
				)
			)
		)
		.limit(10)
}

export async function getWorkspaceStats(workspaceId: string) {
	const user = await getCurrentUser()

	if (!user) {
		return null
	}

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
		return null
	}

	const [memberCount] = await db
		.select({ count: count() })
		.from(workspaceMembers)
		.where(eq(workspaceMembers.workspaceId, workspaceId))

	const [taskCount] = await db
		.select({ count: count() })
		.from(tasks)
		.where(eq(tasks.workspaceId, workspaceId))

	const [todoTaskCount] = await db
		.select({ count: count() })
		.from(tasks)
		.where(
			and(eq(tasks.workspaceId, workspaceId), eq(tasks.status, 'todo'))
		)

	const [inProgressTaskCount] = await db
		.select({ count: count() })
		.from(tasks)
		.where(
			and(
				eq(tasks.workspaceId, workspaceId),
				eq(tasks.status, 'in_progress')
			)
		)

	const [doneTaskCount] = await db
		.select({ count: count() })
		.from(tasks)
		.where(
			and(eq(tasks.workspaceId, workspaceId), eq(tasks.status, 'done'))
		)

	const [activityCount] = await db
		.select({ count: count() })
		.from(workspaceActivities)
		.where(eq(workspaceActivities.workspaceId, workspaceId))

	return {
		memberCount: memberCount?.count || 0,
		taskCount: taskCount?.count || 0,
		todoTaskCount: todoTaskCount?.count || 0,
		inProgressTaskCount: inProgressTaskCount?.count || 0,
		doneTaskCount: doneTaskCount?.count || 0,
		activityCount: activityCount?.count || 0,
	}
}
