'use server';

import { db } from 'db';
import { projects, workspaceMembers, users, tasks } from 'schema';
import { getSession } from '@/modules/authenticatie/helpers/session';
import { TProjectWithDetails } from '../../types';
import { eq, and, sql } from 'drizzle-orm';

export async function getWorkspaceProjects(workspaceId: string): Promise<TProjectWithDetails[]> {
	const session = await getSession();
	if (!session) return [];

	try {
		// Check if user has access to this workspace
		const userMembership = await db
			.select()
			.from(workspaceMembers)
			.where(
				and(
					eq(workspaceMembers.workspaceId, workspaceId),
					eq(workspaceMembers.userId, session.id)
				)
			);

		if (userMembership.length === 0) {
			return [];
		}

		const workspaceProjects = await db
			.select({
				id: projects.id,
				workspaceId: projects.workspaceId,
				title: projects.title,
				description: projects.description,
				emoji: projects.emoji,
				status: projects.status,
				ownerId: projects.ownerId,
				dueDate: projects.dueDate,
				createdAt: projects.createdAt,
				updatedAt: projects.updatedAt,
				owner: {
					id: users.id,
					name: users.name,
					email: users.email,
					avatar: users.avatar,
				},
				workspace: {
					id: sql<string>`${workspaceId}`,
					title: sql<string>`''`,
					emoji: sql<string>`''`,
				},
				taskCount: sql<number>`(
					SELECT COUNT(*)::int 
					FROM ${tasks} t 
					WHERE t.project_id = ${projects.id}
				)`,
				completedTaskCount: sql<number>`(
					SELECT COUNT(*)::int 
					FROM ${tasks} t 
					WHERE t.project_id = ${projects.id} AND t.status = 'done'
				)`,
			})
			.from(projects)
			.innerJoin(users, eq(users.id, projects.ownerId))
			.where(eq(projects.workspaceId, workspaceId))
			.orderBy(projects.createdAt);

		return workspaceProjects;
	} catch (error) {
		console.error('Get workspace projects error:', error);
		return [];
	}
}
