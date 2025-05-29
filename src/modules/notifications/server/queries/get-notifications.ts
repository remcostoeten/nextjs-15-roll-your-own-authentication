'use server';

import { getSession } from '@/modules/authenticatie/helpers/session';
import { asUUID } from '@/shared/types/common';
import { TGetNotificationsOptions, TNotificationWithActor } from '../../types';
import { notificationService } from '../services/notification-service';

export async function getUserNotifications(
  options: TGetNotificationsOptions = {}
): Promise<TNotificationWithActor[]> {
  try {
    const session = await getSession();
    
    if (!session?.id) {
      return [];
    }

    const notifications = await notificationService.getUserNotifications(
      asUUID(session.id),
      options
    );

    return notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}
