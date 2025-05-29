'use server';

import { db } from 'db';
import { workspaces, workspaceMembers, users } from 'schema';
import { getSession } from '@/modules/authenticatie/helpers/session';
import { TBaseMutationResponse } from '@/shared/types/base';
import { TWorkspaceWithOwner } from '../../types';
import { eq, and, sql } from 'drizzle-orm';

export async function updateWorkspace(
	workspaceId: string,
	formData: FormData
): Promise<TBaseMutationResponse<TWorkspaceWithOwner>> {
	try {
		const session = await getSession();
		if (!session) {
			return { success: false, error: 'Unauthorized' };
		}

		// Check if user has permission to update (must be owner or admin)
		const userMembership = await db
			.select({ role: workspaceMembers.role })
			.from(workspaceMembers)
			.where(
				and(
					eq(workspaceMembers.workspaceId, workspaceId),
					eq(workspaceMembers.userId, session.id)
				)
			);

		if (userMembership.length === 0 || !['owner', 'admin'].includes(userMembership[0].role)) {
			return { success: false, error: 'Insufficient permissions' };
		}

		const title = formData.get('title') as string;
		const emoji = formData.get('emoji') as string;
		const description = formData.get('description') as string;

		if (!title?.trim()) {
			return { success: false, error: 'Workspace title is required' };
		}

		if (!emoji?.trim()) {
			return { success: false, error: 'Workspace emoji is required' };
		}

		// Update workspace
		const [updatedWorkspace] = await db
			.update(workspaces)
			.set({
				title: title.trim(),
				emoji: emoji.trim(),
				description: description?.trim() || null,
				updatedAt: new Date(),
			})
			.where(eq(workspaces.id, workspaceId))
			.returning();

		if (!updatedWorkspace) {
			return { success: false, error: 'Workspace not found' };
		}

		// Get the workspace with owner info and member count
		const [workspaceWithDetails] = await db
			.select({
				id: workspaces.id,
				title: workspaces.title,
				emoji: workspaces.emoji,
				description: workspaces.description,
				ownerId: workspaces.ownerId,
				isPersonal: workspaces.isPersonal,
				createdAt: workspaces.createdAt,
				updatedAt: workspaces.updatedAt,
				owner: {
					id: users.id,
					name: users.name,
					email: users.email,
					avatar: users.avatar,
				},
				userRole: workspaceMembers.role,
				memberCount: sql<number>`(
					SELECT COUNT(*)::int 
					FROM ${workspaceMembers} wm 
					WHERE wm.workspace_id = ${workspaces.id}
				)`,
			})
			.from(workspaces)
			.innerJoin(users, eq(users.id, workspaces.ownerId))
			.innerJoin(workspaceMembers, and(
				eq(workspaceMembers.workspaceId, workspaces.id),
				eq(workspaceMembers.userId, session.id)
			))
			.where(eq(workspaces.id, workspaceId));

		return {
			success: true,
			data: workspaceWithDetails,
			message: 'Workspace updated successfully',
		};
	} catch (error) {
		console.error('Update workspace error:', error);
		return { success: false, error: 'Failed to update workspace' };
	}
}
