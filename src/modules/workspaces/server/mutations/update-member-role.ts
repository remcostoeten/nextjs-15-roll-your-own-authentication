'use server';

import { db } from 'db';
import { workspaceMembers } from 'schema';
import { getSession } from '@/modules/authenticatie/helpers/session';
import { TBaseMutationResponse } from '@/shared/types/base';
import { TWorkspaceMemberRole } from '../../types';
import { eq, and } from 'drizzle-orm';

export async function updateMemberRole(
	workspaceId: string,
	memberId: string,
	newRole: TWorkspaceMemberRole
): Promise<TBaseMutationResponse> {
	try {
		const session = await getSession();
		if (!session) {
			return { success: false, error: 'Unauthorized' };
		}

		// Check if current user has permission (only owners can change roles)
		const [currentUserMembership] = await db
			.select({ role: workspaceMembers.role })
			.from(workspaceMembers)
			.where(
				and(
					eq(workspaceMembers.workspaceId, workspaceId),
					eq(workspaceMembers.userId, session.id)
				)
			);

		if (!currentUserMembership || currentUserMembership.role !== 'owner') {
			return { success: false, error: 'Only workspace owners can change member roles' };
		}

		// Get the member whose role is being changed
		const [memberToUpdate] = await db
			.select({ role: workspaceMembers.role, userId: workspaceMembers.userId })
			.from(workspaceMembers)
			.where(
				and(
					eq(workspaceMembers.workspaceId, workspaceId),
					eq(workspaceMembers.userId, memberId)
				)
			);

		if (!memberToUpdate) {
			return { success: false, error: 'Member not found' };
		}

		// Prevent changing owner role
		if (memberToUpdate.role === 'owner') {
			return { success: false, error: 'Cannot change owner role' };
		}

		// Prevent setting someone as owner
		if (newRole === 'owner') {
			return { success: false, error: 'Cannot assign owner role to another member' };
		}

		// Validate role
		if (!['admin', 'member', 'viewer'].includes(newRole)) {
			return { success: false, error: 'Invalid role specified' };
		}

		// Update the member's role
		await db
			.update(workspaceMembers)
			.set({ 
				role: newRole,
				updatedAt: new Date()
			})
			.where(
				and(
					eq(workspaceMembers.workspaceId, workspaceId),
					eq(workspaceMembers.userId, memberId)
				)
			);

		return {
			success: true,
			message: `Member role updated to ${newRole}`,
		};
	} catch (error) {
		console.error('Update member role error:', error);
		return { success: false, error: 'Failed to update member role' };
	}
}
