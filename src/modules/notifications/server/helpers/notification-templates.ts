import { UUID } from '@/shared/types/common';
import { TCreateNotificationInput } from '../../types';

/**
 * Creates a medium-priority system notification welcoming a new user to the platform.
 *
 * @param userId - The unique identifier of the user to receive the notification.
 * @returns A notification input object containing the welcome message.
 */
function welcome(userId: UUID): TCreateNotificationInput {
	return {
		userId,
		type: 'system',
		title: 'Welcome to the platform!',
		message: 'Thank you for joining. Get started by exploring your dashboard.',
		priority: 'medium',
	};
}

/**
 * Generates a high-priority notification inviting a user to join a workspace.
 *
 * The notification includes the workspace title, an optional inviter's email, and an optional personalized message. The action URL directs the user to accept the invitation. Metadata contains workspace and inviter details when provided.
 *
 * @param userId - The ID of the user receiving the invitation.
 * @param workspaceTitle - The name of the workspace the user is invited to join.
 * @param inviteUrl - The URL for the user to accept the invitation.
 * @param actorId - (Optional) The ID of the user who sent the invitation.
 * @param actorEmail - (Optional) The email of the user who sent the invitation.
 * @param workspaceId - (Optional) The ID of the workspace.
 * @param customMessage - (Optional) A personalized message from the inviter.
 * @returns A structured notification input for a workspace invitation event.
 */
function workspaceInvitation(
	userId: UUID,
	workspaceTitle: string,
	inviteUrl: string,
	actorId?: UUID,
	actorEmail?: string,
	workspaceId?: string,
	customMessage?: string
): TCreateNotificationInput {
	const baseMessage = `You've been invited to join the workspace "${workspaceTitle}"${actorEmail ? ` by ${actorEmail}` : ''}`;
	const fullMessage = customMessage ? `${baseMessage}\n\nPersonal message: "${customMessage}"` : baseMessage;

	return {
		userId,
		type: 'workspace_invite',
		title: `Invitation to join ${workspaceTitle}`,
		message: fullMessage,
		priority: 'high',
		actionUrl: inviteUrl,
		actionLabel: 'Accept Invitation',
		metadata: {
			workspaceId,
			actorEmail,
			customMessage,
			inviterEmail: actorEmail
		},
		...(actorEmail && { actorEmail }),
		...(actorId && { actorId }),
	};
}

/**
 * Creates a notification indicating that a user has joined a workspace.
 *
 * @param userId - The ID of the user who joined the workspace.
 * @param workspaceTitle - The title of the workspace the user joined.
 * @param workspaceId - The unique identifier of the workspace.
 * @param actorId - The ID of the actor who initiated the join, if applicable.
 * @returns A notification input object for the workspace join event.
 */
function workspaceJoined(
	userId: UUID,
	workspaceTitle: string,
	workspaceId: string,
	actorId?: UUID
): TCreateNotificationInput {
	return {
		userId,
		type: 'member_joined',
		title: `Welcome to ${workspaceTitle}`,
		message: `You've successfully joined the workspace "${workspaceTitle}"`,
		priority: 'medium',
		actionUrl: `/workspaces/${workspaceId}`,
		actionLabel: 'Go to Workspace',
		metadata: { workspaceId },
		...(actorId && { actorId }),
	};
}

export const notificationTemplates = {
	welcome,
	workspaceInvitation,
	workspaceJoined,
};
