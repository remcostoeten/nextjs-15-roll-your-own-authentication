'use server';

import { getSession } from '@/modules/authenticatie/helpers/session';
import { asUUID } from '@/shared/types/common';
import { TGetNotificationsOptions, TNotificationWithActor } from '../../types';
import { notificationService } from '../services/notification-service';

/**
 * Retrieves notifications for the currently authenticated user, optionally filtered by provided options.
 *
 * @param options - Optional filters or parameters to customize the notification retrieval.
 * @returns An array of notifications for the user, or an empty array if the user is not authenticated or an error occurs.
 */
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
