'use server';

import { getSession } from '@/modules/authenticatie/helpers/session';
import { TBaseMutationResponse } from '@/shared/types/base';
import { randomBytes } from 'crypto';
import { db } from 'db';
import { and, eq, isNull } from 'drizzle-orm';
import { users, workspaceInvites, workspaceMembers, workspaces } from 'schema';
import { notificationService } from '@/modules/notifications/server/services/notification-service';
import { notificationTemplates } from '@/modules/notifications/server/helpers/notification-templates';
import { asUUID } from '@/shared/types/common';

export async function inviteUser(formData: FormData): Promise<TBaseMutationResponse> {
	try {
		const session = await getSession();
		if (!session) {
			return { success: false, error: 'Unauthorized' };
		}

		const workspaceId = formData.get('workspaceId') as string;
		const email = formData.get('email') as string;
		const role = formData.get('role') as 'admin' | 'member' | 'viewer';
		const message = formData.get('message') as string;

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
			.where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(users.email, email)));

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
					isNull(workspaceInvites.acceptedAt)
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
		const inviteUrl = `${
			process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'
		}/dashboard/invite/${token}`;
		console.log('\n🎉 WORKSPACE INVITATION CREATED!');
		console.log('================================');
		console.log(`📧 Email: ${email}`);
		console.log(`🔗 Invitation Link: ${inviteUrl}`);
		console.log(`⏰ Expires: ${expiresAt.toLocaleDateString()}`);
		console.log('================================\n');

		// TODO: Send actual email notification
		// await sendInvitationEmail(email, inviteUrl, workspace);

		// After creating invitation
		// Get workspace info for notification
		const [workspace] = await db
			.select({
				id: workspaces.id,
				title: workspaces.title,
			})
			.from(workspaces)
			.where(eq(workspaces.id, workspaceId));

		// Get inviter's information
		const [inviter] = await db
			.select({
				id: users.id,
				email: users.email,
				name: users.name
			})
			.from(users)
			.where(eq(users.id, session.id));

		// Check if user exists with this email
		const [invitedUser] = await db
			.select({ id: users.id })
			.from(users)
			.where(eq(users.email, email));

		if (invitedUser) {
			const notificationData = notificationTemplates.workspaceInvitation(
				asUUID(invitedUser.id),
				workspace.title,
				inviteUrl,
				asUUID(session.id),
				inviter.email,
				workspace.id,
				message || undefined
			);

			await notificationService.createNotification(notificationData);
		}

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
