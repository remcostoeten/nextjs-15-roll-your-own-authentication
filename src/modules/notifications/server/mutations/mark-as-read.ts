'use server';

import { getSession } from '@/modules/authenticatie/helpers/session';
import { TBaseMutationResponse } from '@/shared/types/base';
import { asUUID } from '@/shared/types/common';
import { notificationService } from '../services/notification-service';

/**
 * Marks the specified notifications as read for the current user.
 *
 * @param notificationIds - An array of notification IDs to mark as read.
 * @returns A mutation response indicating success or failure of the operation.
 */
export async function markNotificationsAsRead(
	notificationIds: string[]
): Promise<TBaseMutationResponse<void>> {
	try {
		const session = await getSession();

		if (!session?.id) {
			return { success: false, error: 'Unauthorized' };
		}

		await notificationService.markAsRead(notificationIds.map((id) => asUUID(id)));

		return {
			success: true,
			message: 'Notifications marked as read',
		};
	} catch (error) {
		console.error('Error marking notifications as read:', error);
		return { success: false, error: 'Failed to mark notifications as read' };
	}
}

/**
 * Marks all notifications as read for the currently authenticated user.
 *
 * @returns A mutation response indicating whether all notifications were successfully marked as read.
 */
export async function markAllNotificationsAsRead(): Promise<TBaseMutationResponse<void>> {
	try {
		const session = await getSession();

		if (!session?.id) {
			return { success: false, error: 'Unauthorized' };
		}

		await notificationService.markAllAsRead(asUUID(session.id));

		return {
			success: true,
			message: 'All notifications marked as read',
		};
	} catch (error) {
		console.error('Error marking all notifications as read:', error);
		return { success: false, error: 'Failed to mark all notifications as read' };
	}
}
