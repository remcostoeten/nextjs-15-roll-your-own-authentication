import { TBaseEntity } from "@/shared/types/base";
import { UUID } from "@/shared/types/common";

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
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, unknown>;
  actorId?: UUID;
  expiresAt?: Date;
};

export type TNotificationWithActor = TNotification & {
  actor?: {
    id: UUID;
    name: string;
    email: string;
    avatar?: string;
  };
};

export type TCreateNotificationInput = Omit<TNotification, 'id' | 'createdAt' | 'updatedAt' | 'read' | 'archived'>;

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
