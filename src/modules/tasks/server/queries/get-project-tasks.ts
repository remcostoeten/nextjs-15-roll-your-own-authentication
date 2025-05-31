'use server';

import { db } from 'db';
import { tasks, projects, workspaceMembers, users } from 'schema';
import { getSession } from '@/modules/authenticatie/helpers/session';
import { TTaskWithDetails } from '../../types';
import { eq, and } from 'drizzle-orm';

export async function getProjectTasks(projectId: string): Promise<TTaskWithDetails[]> {
	const session = await getSession();
	if (!session) return [];

	try {
		// First get the project to check workspace access
		const [project] = await db
			.select({ workspaceId: projects.workspaceId })
			.from(projects)
			.where(eq(projects.id, projectId));

		if (!project) return [];

		// Check if user has access to the workspace
		const userMembership = await db
			.select()
			.from(workspaceMembers)
			.where(
				and(
					eq(workspaceMembers.workspaceId, project.workspaceId),
					eq(workspaceMembers.userId, session.id)
				)
			);

		if (userMembership.length === 0) {
			return [];
		}

		const projectTasks = await db
			.select({
				id: tasks.id,
				projectId: tasks.projectId,
				title: tasks.title,
				description: tasks.description,
				status: tasks.status,
				priority: tasks.priority,
				assigneeId: tasks.assigneeId,
				createdBy: tasks.createdBy,
				dueDate: tasks.dueDate,
				completedAt: tasks.completedAt,
				createdAt: tasks.createdAt,
				updatedAt: tasks.updatedAt,
				creator: {
					id: users.id,
					name: users.name,
					email: users.email,
					avatar: users.avatar,
				},
				assignee: {
					id: sql<string>`assignee.id`,
					name: sql<string>`assignee.name`,
					email: sql<string>`assignee.email`,
					avatar: sql<string>`assignee.avatar`,
				},
				project: {
					id: projects.id,
					title: projects.title,
					emoji: projects.emoji,
				},
			})
			.from(tasks)
			.innerJoin(users, eq(users.id, tasks.createdBy))
			.leftJoin(sql`${users} as assignee`, sql`assignee.id = ${tasks.assigneeId}`)
			.innerJoin(projects, eq(projects.id, tasks.projectId))
			.where(eq(tasks.projectId, projectId))
			.orderBy(tasks.createdAt);

		return projectTasks.map((task) => ({
			...task,
			assignee: task.assignee.id ? task.assignee : null,
		}));
	} catch (error) {
		console.error('Get project tasks error:', error);
		return [];
	}
}
