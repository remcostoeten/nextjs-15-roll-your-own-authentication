'use server';

import { db } from 'db';
import { workspaceMembers } from 'schema';
import { getSession } from '@/modules/authenticatie/helpers/session';
import { TBaseMutationResponse } from '@/shared/types/base';
import { eq, and } from 'drizzle-orm';

export async function leaveWorkspace(
	workspaceId: string
): Promise<TBaseMutationResponse> {
	try {
		const session = await getSession();
		if (!session) {
			return { success: false, error: 'Unauthorized' };
		}

		// Get user's membership
		const [membership] = await db
			.select({ role: workspaceMembers.role })
			.from(workspaceMembers)
			.where(
				and(
					eq(workspaceMembers.workspaceId, workspaceId),
					eq(workspaceMembers.userId, session.id)
				)
			);

		if (!membership) {
			return { success: false, error: 'You are not a member of this workspace' };
		}

		// Prevent owner from leaving (they must transfer ownership or delete workspace)
		if (membership.role === 'owner') {
			return { 
				success: false, 
				error: 'Workspace owners cannot leave. Transfer ownership or delete the workspace instead.' 
			};
		}

		// Remove user from workspace
		await db
			.delete(workspaceMembers)
			.where(
				and(
					eq(workspaceMembers.workspaceId, workspaceId),
					eq(workspaceMembers.userId, session.id)
				)
			);

		return {
			success: true,
			message: 'Successfully left the workspace',
		};
	} catch (error) {
		console.error('Leave workspace error:', error);
		return { success: false, error: 'Failed to leave workspace' };
	}
}
