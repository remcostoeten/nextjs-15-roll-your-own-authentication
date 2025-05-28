'use server';

import { db } from 'db';
import { workspaceInvites, workspaceMembers, workspaces, users } from 'schema';
import { getSession } from '@/modules/authenticatie/helpers/session';
import { TBaseMutationResponse } from '@/shared/types/base';
import { TWorkspaceInvite } from '../../types';
import { eq, and } from 'drizzle-orm';
import { randomBytes } from 'crypto';

export async function inviteMember(
	workspaceId: string,
	email: string,
	role: 'admin' | 'member' | 'viewer' = 'member'
): Promise<TBaseMutationResponse<TWorkspaceInvite>> {
	try {
		const session = await getSession();
		if (!session) {
			return { success: false, error: 'Unauthorized' };
		}

		// Check if user has permission to invite (must be owner or admin)
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

		// Check if user is already a member
		const existingMember = await db
			.select()
			.from(workspaceMembers)
			.innerJoin(users, eq(users.id, workspaceMembers.userId))
			.where(
				and(
					eq(workspaceMembers.workspaceId, workspaceId),
					eq(users.email, email)
				)
			);

		if (existingMember.length > 0) {
			return { success: false, error: 'User is already a member of this workspace' };
		}

		// Check if there's already a pending invite
		const existingInvite = await db
			.select()
			.from(workspaceInvites)
			.where(
				and(
					eq(workspaceInvites.workspaceId, workspaceId),
					eq(workspaceInvites.email, email),
					eq(workspaceInvites.acceptedAt, null)
				)
			);

		if (existingInvite.length > 0) {
			return { success: false, error: 'An invitation has already been sent to this email' };
		}

		// Generate invite token
		const token = randomBytes(32).toString('hex');
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

		// Create the invite
		const [invite] = await db
			.insert(workspaceInvites)
			.values({
				workspaceId,
				email,
				role,
				invitedBy: session.id,
				token,
				expiresAt,
			})
			.returning();

		// Get workspace and inviter info for the response
		const [workspace] = await db
			.select({
				id: workspaces.id,
				title: workspaces.title,
				emoji: workspaces.emoji,
			})
			.from(workspaces)
			.where(eq(workspaces.id, workspaceId));

		const [inviter] = await db
			.select({
				id: users.id,
				name: users.name,
				email: users.email,
			})
			.from(users)
			.where(eq(users.id, session.id));

		const inviteWithDetails: TWorkspaceInvite = {
			...invite,
			inviter,
			workspace,
		};

		// TODO: Send email notification here
		// await sendInviteEmail(email, inviteWithDetails);

		return {
			success: true,
			data: inviteWithDetails,
			message: 'Invitation sent successfully',
		};
	} catch (error) {
		console.error('Invite member error:', error);
		return { success: false, error: 'Failed to send invitation' };
	}
}
