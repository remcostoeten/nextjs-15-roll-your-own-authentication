'use server';

import { getSession } from '@/modules/authenticatie/helpers/session';
import { TBaseMutationResponse } from '@/shared/types/base';
import { randomBytes } from 'crypto';
import { db } from 'db';
import { and, eq } from 'drizzle-orm';
import { users, workspaceInvites, workspaceMembers } from 'schema';

export async function inviteUser(formData: FormData): Promise<TBaseMutationResponse> {
	try {
		const session = await getSession();
		if (!session) {
			return { success: false, error: 'Unauthorized' };
		}

		const workspaceId = formData.get('workspaceId') as string;
		const email = formData.get('email') as string;
		const role = formData.get('role') as 'admin' | 'member' | 'viewer';

		if (!workspaceId || !email || !role) {
			return { success: false, error: 'Missing required fields' };
		}

		// Check if user has permission to invite (owner or admin)
		const [membership] = await db
			.select()
			.from(workspaceMembers)
			.where(
				and(
					eq(workspaceMembers.workspaceId, workspaceId),
					eq(workspaceMembers.userId, session.id)
				)
			);

		if (!membership || !['owner', 'admin'].includes(membership.role)) {
			return { success: false, error: 'Permission denied' };
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
			return { success: false, error: 'Invitation already sent to this email' };
		}

		// Create invite
		const token = randomBytes(32).toString('hex');
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

		await db.insert(workspaceInvites).values({
			workspaceId,
			email,
			role,
			invitedBy: session.id,
			token,
			expiresAt,
		});

		// For development: Log the invitation link
		const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/invite/${token}`;
		console.log('\n🎉 WORKSPACE INVITATION CREATED!');
		console.log('================================');
		console.log(`📧 Email: ${email}`);
		console.log(`🔗 Invitation Link: ${inviteUrl}`);
		console.log(`⏰ Expires: ${expiresAt.toLocaleDateString()}`);
		console.log('================================\n');

		// TODO: Send actual email notification
		// await sendInvitationEmail(email, inviteUrl, workspace);

		// After creating invitation
		await createNotification({
			userId: asUUID(invitedUserId), // If user exists
			type: 'workspace_invite',
			title: `Invitation to join ${workspace.title}`,
			message: `You've been invited to join the workspace "${workspace.title}"`,
			priority: 'high',
			actionUrl: inviteUrl,
			actionLabel: 'Accept Invitation',
			metadata: {
				workspaceId: workspace.id,
				inviterId: session.id,
			},
			actorId: asUUID(session.id),
		});

		return {
			success: true,
			message: 'Invitation sent successfully',
			data: {
				inviteUrl, // Include the URL in the response for development
				email,
				expiresAt,
			},
		};
	} catch (error) {
		console.error('Invite user error:', error);
		return { success: false, error: 'Failed to send invitation' };
	}
}
