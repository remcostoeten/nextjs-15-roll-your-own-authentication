'use server';

import { db } from 'db';
import { workspaces, workspaceMembers } from 'schema';
import { getSession } from '@/modules/authenticatie/helpers/session';
import { TBaseMutationResponse } from '@/shared/types/base';
import { eq, and } from 'drizzle-orm';

export async function deleteWorkspace(workspaceId: string): Promise<TBaseMutationResponse> {
	try {
		const session = await getSession();
		if (!session) {
			return { success: false, error: 'Unauthorized' };
		}

		// Check if user is the owner of the workspace
		const [workspace] = await db
			.select({ ownerId: workspaces.ownerId, title: workspaces.title })
			.from(workspaces)
			.where(eq(workspaces.id, workspaceId));

		if (!workspace) {
			return { success: false, error: 'Workspace not found' };
		}

		if (workspace.ownerId !== session.id) {
			return { success: false, error: 'Only workspace owners can delete workspaces' };
		}

		// Check if this is a personal workspace
		const [workspaceDetails] = await db
			.select({ isPersonal: workspaces.isPersonal })
			.from(workspaces)
			.where(eq(workspaces.id, workspaceId));

		if (workspaceDetails?.isPersonal) {
			return { success: false, error: 'Personal workspaces cannot be deleted' };
		}

		// Delete the workspace (cascade will handle members, invites, etc.)
		await db.delete(workspaces).where(eq(workspaces.id, workspaceId));

		return {
			success: true,
			message: `Workspace "${workspace.title}" has been deleted successfully`,
		};
	} catch (error) {
		console.error('Delete workspace error:', error);
		return { success: false, error: 'Failed to delete workspace' };
	}
}
