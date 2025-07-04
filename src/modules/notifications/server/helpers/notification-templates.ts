import { UUID } from '@/shared/types/common';
import { TCreateNotificationInput } from '../../types';

/**
 * @description Generates a system welcome notification for a new user.
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
 * @description Creates a workspace invitation notification for a user.
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
 * @description Generates a notification when a user joins a workspace.
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
