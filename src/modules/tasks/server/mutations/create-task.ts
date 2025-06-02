'use server';

import { db } from 'db';
import { tasks, projects, workspaceMembers } from 'schema';
import { getSession } from '@/modules/authenticatie/helpers/session';
import { TBaseMutationResponse } from '@/shared/types/base';
import { TBaseTask } from '../../types';
import { and, eq } from 'drizzle-orm';

export async function createTask(formData: FormData): Promise<TBaseMutationResponse<TBaseTask>> {
	try {
		const session = await getSession();
		if (!session) {
			return { success: false, error: 'Unauthorized' };
		}

		const projectId = formData.get('projectId') as string;
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const priority = formData.get('priority') as 'low' | 'medium' | 'high' | 'urgent';
		const assigneeId = formData.get('assigneeId') as string;

		if (!projectId || !title?.trim()) {
			return { success: false, error: 'Project and title are required' };
		}

		// Get project to check workspace access
		const [project] = await db
			.select({ workspaceId: projects.workspaceId })
			.from(projects)
			.where(eq(projects.id, projectId));

		if (!project) {
			return { success: false, error: 'Project not found' };
		}

		// Check workspace access
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
			return { success: false, error: 'Access denied to workspace' };
		}

		// If assignee is specified, check they have access to workspace
		if (assigneeId) {
			const assigneeMembership = await db
				.select()
				.from(workspaceMembers)
				.where(
					and(
						eq(workspaceMembers.workspaceId, project.workspaceId),
						eq(workspaceMembers.userId, assigneeId)
					)
				);

			if (assigneeMembership.length === 0) {
				return { success: false, error: 'Assignee does not have access to this workspace' };
			}
		}

		const [task] = await db
			.insert(tasks)
			.values({
				projectId,
				title: title.trim(),
				description: description?.trim() || null,
				priority: priority || 'medium',
				assigneeId: assigneeId || null,
				createdBy: session.id,
			})
			.returning();

		return {
			success: true,
			data: task,
			message: 'Task created successfully',
		};
	} catch (error) {
		console.error('Create task error:', error);
		return { success: false, error: 'Failed to create task' };
	}
}
