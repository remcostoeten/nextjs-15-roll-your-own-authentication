'use server';

import { getSession } from '@/modules/authenticatie/helpers/session';
import { TBaseMutationResponse } from '@/shared/types/base';
import { asUUID } from '@/shared/types/common';
import { TCreateNotificationInput, TNotificationWithActor } from '../../types';
import { notificationService } from '../services/notification-service';

export async function createNotification(
	data: Omit<TCreateNotificationInput, 'userId'>
): Promise<TBaseMutationResponse<TNotificationWithActor>> {
	try {
		const session = await getSession();

		if (!session?.id) {
			return { success: false, error: 'Unauthorized' };
		}

		const notificationData: TCreateNotificationInput = {
			userId: asUUID(session.id),
			...data,
		};

		if (data.expiresAt) {
			notificationData.expiresAt = new Date(data.expiresAt as any);
		}

		const notification = await notificationService.createNotification(notificationData);

		return {
			success: true,
			data: notification,
			message: 'Notification created successfully',
		};
	} catch (error) {
		console.error('Error creating notification:', error);
		return { success: false, error: 'Failed to create notification' };
	}
}
