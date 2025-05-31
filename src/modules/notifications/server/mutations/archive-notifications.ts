'use server';

import { getSession } from '@/modules/authenticatie/helpers/session';
import { TBaseMutationResponse } from '@/shared/types/base';
import { asUUID } from '@/shared/types/common';
import { notificationService } from '../services/notification-service';

export async function archiveNotifications(
	notificationIds: string[]
): Promise<TBaseMutationResponse<void>> {
	try {
		const session = await getSession();

		if (!session?.id) {
			return { success: false, error: 'Unauthorized' };
		}

		await notificationService.archiveNotifications(notificationIds.map((id) => asUUID(id)));

		return {
			success: true,
			message: 'Notifications archived successfully',
		};
	} catch (error) {
		console.error('Error archiving notifications:', error);
		return { success: false, error: 'Failed to archive notifications' };
	}
}
