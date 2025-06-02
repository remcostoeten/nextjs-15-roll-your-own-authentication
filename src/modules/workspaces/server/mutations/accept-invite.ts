'use server';

import { db } from 'db';
import { workspaceInvites, workspaceMembers, users } from 'schema';
import { getSession } from '@/modules/authenticatie/helpers/session';
import { TBaseMutationResponse } from '@/shared/types/base';
import { and, eq } from 'drizzle-orm';

export async function acceptInvite(token: string): Promise<TBaseMutationResponse> {
	try {
		const session = await getSession();
		if (!session) {
			return { success: false, error: 'Unauthorized' };
		}

		// Get the invite
		const [invite] = await db
			.select()
			.from(workspaceInvites)
			.where(and(eq(workspaceInvites.token, token), eq(workspaceInvites.acceptedAt, null)));

		if (!invite) {
			return { success: false, error: 'Invalid or expired invitation' };
		}

		if (new Date() > invite.expiresAt) {
			return { success: false, error: 'Invitation has expired' };
		}

		// Get user email to verify
		const [user] = await db
			.select({ email: users.email })
			.from(users)
			.where(eq(users.id, session.id));

		if (!user || user.email !== invite.email) {
			return { success: false, error: 'Invitation email does not match your account' };
		}

		// Check if user is already a member
		const existingMember = await db
			.select()
			.from(workspaceMembers)
			.where(
				and(
					eq(workspaceMembers.workspaceId, invite.workspaceId),
					eq(workspaceMembers.userId, session.id)
				)
			);

		if (existingMember.length > 0) {
			return { success: false, error: 'You are already a member of this workspace' };
		}

		// Add user to workspace
		await db.insert(workspaceMembers).values({
			workspaceId: invite.workspaceId,
			userId: session.id,
			role: invite.role,
			invitedBy: invite.invitedBy,
		});

		// Mark invite as accepted
		await db
			.update(workspaceInvites)
			.set({ acceptedAt: new Date() })
			.where(eq(workspaceInvites.id, invite.id));

		return {
			success: true,
			message: 'Successfully joined workspace',
			redirect: `/dashboard?workspace=${invite.workspaceId}`,
		};
	} catch (error) {
		console.error('Accept invite error:', error);
		return { success: false, error: 'Failed to accept invitation' };
	}
}
