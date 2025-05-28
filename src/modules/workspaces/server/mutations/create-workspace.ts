'use server';

import { db } from 'db';
import { workspaces, workspaceMembers } from 'schema';
import { getSession } from '@/modules/authenticatie/helpers/session';
import { TBaseMutationResponse } from '@/shared/types/base';
import { TWorkspaceWithOwner } from '../../types';
import { eq } from 'drizzle-orm';
import { users } from 'schema';

export async function createWorkspace(
	formData: FormData
): Promise<TBaseMutationResponse<TWorkspaceWithOwner>> {
	try {
		const session = await getSession();
		if (!session) {
			return { success: false, error: 'Unauthorized' };
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

		// Create workspace
		const [workspace] = await db
			.insert(workspaces)
			.values({
				title: title.trim(),
				emoji: emoji.trim(),
				description: description?.trim() || null,
				ownerId: session.id,
				isPersonal: false,
			})
			.returning();

		// Add creator as owner member
		await db.insert(workspaceMembers).values({
			workspaceId: workspace.id,
			userId: session.id,
			role: 'owner',
		});

		// Get the user info for the response
		const [user] = await db
			.select({
				id: users.id,
				name: users.name,
				email: users.email,
				avatar: users.avatar,
			})
			.from(users)
			.where(eq(users.id, session.id));

		const workspaceWithOwner: TWorkspaceWithOwner = {
			...workspace,
			owner: user,
			memberCount: 1,
			userRole: 'owner',
		};

		return {
			success: true,
			data: workspaceWithOwner,
			message: 'Workspace created successfully',
		};
	} catch (error) {
		console.error('Create workspace error:', error);
		return { success: false, error: 'Failed to create workspace' };
	}
}

