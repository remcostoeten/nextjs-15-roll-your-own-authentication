import { TBaseEntity } from '@/shared/types/base';
import { UUID } from '@/shared/types/common';

export type TNotificationType =
	| 'workspace_invite'
	| 'member_joined'
	| 'member_left'
	| 'project_created'
	| 'project_updated'
	| 'task_assigned'
	| 'task_completed'
	| 'mention'
	| 'comment'
	| 'file_shared'
	| 'system';

export type TNotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TNotification = TBaseEntity & {
	userId: UUID;
	type: TNotificationType;
	title: string;
	message: string;
	read: boolean;
	archived: boolean;
	priority: TNotificationPriority;
	actionUrl?: string | undefined;
	actionLabel?: string | undefined;
	metadata?: Record<string, unknown>;
	actorId?: UUID | undefined;
	expiresAt?: Date | null;
	actorEmail?: string | undefined;
};

export type TNotificationWithActor = TNotification & {
	actor?: {
		id: UUID;
		name: string;
		email: string;
		avatar?: string | undefined;
	} | undefined;
};

export type TCreateNotificationInput = Omit<
	TNotification,
	'id' | 'createdAt' | 'updatedAt' | 'read' | 'archived'
>;

export type TNotificationStats = {
	total: number;
	unread: number;
	highPriority: number;
};

export type TGetNotificationsOptions = {
	limit?: number;
	offset?: number;
	unreadOnly?: boolean;
	types?: TNotificationType[];
	includeArchived?: boolean;
};

export type TNotificationPreferences = {
	id: UUID;
	userId: UUID;
	taskUpdates: boolean;
	projectUpdates: boolean;
	teamMessages: boolean;
	securityAlerts: boolean;
	workspaceInvites: boolean;
	mentions: boolean;
	comments: boolean;
	fileShares: boolean;
	systemNotifications: boolean;
	emailNotifications: boolean;
	pushNotifications: boolean;
	createdAt: Date;
	updatedAt: Date;
};

export type TUpdateNotificationPreferences = Omit<
	TNotificationPreferences,
	'id' | 'userId' | 'createdAt' | 'updatedAt'
>;

export type TNotificationPreferencesInput = {
	taskUpdates: boolean;
	projectUpdates: boolean;
	teamMessages: boolean;
	securityAlerts: boolean;
	workspaceInvites?: boolean;
	mentions?: boolean;
	comments?: boolean;
	fileShares?: boolean;
	systemNotifications?: boolean;
	emailNotifications?: boolean;
	pushNotifications?: boolean;
};
