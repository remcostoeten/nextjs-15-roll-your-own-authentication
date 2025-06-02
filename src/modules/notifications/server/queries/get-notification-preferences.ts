'use server';

import { getSession } from '@/modules/authenticatie/helpers/session';
import { asUUID } from '@/shared/types/common';
import { TNotificationPreferences } from '../../types';
import { notificationRepository } from '../repositories/notification-repository';

export async function getNotificationPreferences(): Promise<TNotificationPreferences | null> {
	try {
		const session = await getSession();

		if (!session?.id) {
			return null;
		}

		const preferences = await notificationRepository().getOrCreatePreferences(
			asUUID(session.id)
		);
		return preferences;
	} catch (error) {
		console.error('Error fetching notification preferences:', error);
		return null;
	}
}
