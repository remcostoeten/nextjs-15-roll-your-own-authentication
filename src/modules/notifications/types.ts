import { TBaseEntity, TBaseUser } from '@/shared/types/base';

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

export type TBaseNotification = TBaseEntity & {
  userId: string;
  type: TNotificationType;
  title: string;
  message: string;
  priority: TNotificationPriority;
  isRead: boolean;
  isArchived: boolean;
  actionUrl?: string | null;
  actionLabel?: string | null;
  metadata?: Record<string, any> | null;
  expiresAt?: Date | null;
};

export type TNotificationWithActor = TBaseNotification & {
  actor?: Pick<TBaseUser, 'id' | 'name' | 'email' | 'avatar'> | null;
  actorId?: string | null;
};

export type TNotificationGroup = {
  type: TNotificationType;
  count: number;
  latestNotification: TNotificationWithActor;
  notifications: TNotificationWithActor[];
};

export type TNotificationStats = {
  total: number;
  unread: number;
  byType: Record<TNotificationType, number>;
  byPriority: Record<TNotificationPriority, number>;
};

export type TNotificationPreferences = {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  inAppNotifications: boolean;
  notificationTypes: Partial<Record<TNotificationType, boolean>>;
  quietHours: {
    enabled: boolean;
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
  };
};

export type TCreateNotificationInput = {
  userId: string;
  type: TNotificationType;
  title: string;
  message: string;
  priority?: TNotificationPriority;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
  actorId?: string;
  expiresAt?: Date;
};
