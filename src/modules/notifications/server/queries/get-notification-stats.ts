'use server';

import { getSession } from '@/modules/authenticatie/helpers/session';
import { asUUID } from '@/shared/types/common';
import { TNotificationStats } from '../../types';
import { notificationService } from '../services/notification-service';

/**
 * Retrieves notification statistics for the current user session.
 *
 * @returns The notification statistics for the current session, or `null` if the session is invalid or an error occurs.
 */
export async function getNotificationStats(): Promise<TNotificationStats | null> {
	try {
		const session = await getSession();

		if (!session?.id) {
			return null;
		}

		const stats = await notificationService.getNotificationStats(asUUID(session.id));
		return stats;
	} catch (error) {
		console.error('Error fetching notification stats:', error);
		return null;
	}
}
