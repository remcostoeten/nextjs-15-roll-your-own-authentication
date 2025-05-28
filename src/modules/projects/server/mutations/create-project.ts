'use server';

import { db } from 'db';
import { projects, workspaceMembers } from 'schema';
import { getSession } from '@/modules/authenticatie/helpers/session';
import { TBaseMutationResponse } from '@/shared/types/base';
import { TBaseProject } from '../../types';
import { and, eq } from 'drizzle-orm';

export async function createProject(formData: FormData): Promise<TBaseMutationResponse<TBaseProject>> {
	try {
		const session = await getSession();
		if (!session) {
			return { success: false, error: 'Unauthorized' };
		}

		const workspaceId = formData.get('workspaceId') as string;
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const emoji = formData.get('emoji') as string;

		if (!workspaceId || !title?.trim()) {
			return { success: false, error: 'Workspace and title are required' };
		}

		// Check if user has access to workspace
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
			return { success: false, error: 'Access denied to workspace' };
		}

		const [project] = await db
			.insert(projects)
			.values({
				workspaceId,
				title: title.trim(),
				description: description?.trim() || null,
				emoji: emoji?.trim() || '📋',
				ownerId: session.id,
			})
			.returning();

		return {
			success: true,
			data: project,
			message: 'Project created successfully',
		};
	} catch (error) {
		console.error('Create project error:', error);
		return { success: false, error: 'Failed to create project' };
	}
}
