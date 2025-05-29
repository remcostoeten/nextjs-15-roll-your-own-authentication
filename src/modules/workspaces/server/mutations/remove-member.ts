'use server';

import { db } from 'db';
import { workspaceMembers } from 'schema';
import { getSession } from '@/modules/authenticatie/helpers/session';
import { TBaseMutationResponse } from '@/shared/types/base';
import { eq, and } from 'drizzle-orm';

export async function removeMember(
	workspaceId: string,
	memberId: string
): Promise<TBaseMutationResponse> {
	try {
		const session = await getSession();
		if (!session) {
			return { success: false, error: 'Unauthorized' };
		}

		// Check if current user has permission (owner or admin)
		const [currentUserMembership] = await db
			.select({ role: workspaceMembers.role })
			.from(workspaceMembers)
			.where(
				and(
					eq(workspaceMembers.workspaceId, workspaceId),
					eq(workspaceMembers.userId, session.id)
				)
			);

		if (!currentUserMembership || !['owner', 'admin'].includes(currentUserMembership.role)) {
			return { success: false, error: 'Insufficient permissions' };
		}

		// Get the member to be removed
		const [memberToRemove] = await db
			.select({ role: workspaceMembers.role, userId: workspaceMembers.userId })
			.from(workspaceMembers)
			.where(
				and(
					eq(workspaceMembers.workspaceId, workspaceId),
					eq(workspaceMembers.userId, memberId)
				)
			);

		if (!memberToRemove) {
			return { success: false, error: 'Member not found' };
		}

		// Prevent removing the owner
		if (memberToRemove.role === 'owner') {
			return { success: false, error: 'Cannot remove workspace owner' };
		}

		// Prevent non-owners from removing admins
		if (memberToRemove.role === 'admin' && currentUserMembership.role !== 'owner') {
			return { success: false, error: 'Only owners can remove admins' };
		}

		// Prevent users from removing themselves (they should leave instead)
		if (memberToRemove.userId === session.id) {
			return { success: false, error: 'Use leave workspace instead of removing yourself' };
		}

		// Remove the member
		await db
			.delete(workspaceMembers)
			.where(
				and(
					eq(workspaceMembers.workspaceId, workspaceId),
					eq(workspaceMembers.userId, memberId)
				)
			);

		return {
			success: true,
			message: 'Member removed successfully',
		};
	} catch (error) {
		console.error('Remove member error:', error);
		return { success: false, error: 'Failed to remove member' };
	}
}
