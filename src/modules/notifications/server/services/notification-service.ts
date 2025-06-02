import { UUID } from '@/shared/types/common';
import {
	TCreateNotificationInput,
	TGetNotificationsOptions,
	TNotificationStats,
	TNotificationWithActor,
} from '../../types';
import { notificationRepository } from '../repositories/notification-repository';

/**
 * Creates a notification and returns it with actor details if an actor is specified.
 *
 * If {@link data.actorId} is provided, the function retrieves the most recent notification for the user, including actor information. Otherwise, it returns the created notification.
 *
 * @param data - The notification creation input.
 * @returns The created notification, including actor details if applicable.
 */
export async function createNotification(
	data: TCreateNotificationInput
): Promise<TNotificationWithActor> {
	const repository = notificationRepository();
	return await repository.create(data).then((notification) => {
		if (data.actorId) {
			return repository
				.findByUserId(data.userId, { limit: 1 })
				.then(([notificationWithActor]) => notificationWithActor);
		}

		return notification as TNotificationWithActor;
	});
}

/**
 * Retrieves notifications for a user, optionally filtered by provided options.
 *
 * @param userId - The unique identifier of the user whose notifications are to be fetched.
 * @param options - Optional filters or pagination settings for retrieving notifications.
 * @returns An array of notifications with actor details for the specified user.
 */
export async function getUserNotifications(
	userId: UUID,
	options: TGetNotificationsOptions = {}
): Promise<TNotificationWithActor[]> {
	return await notificationRepository().findByUserId(userId, options);
}

/**
 * Marks the specified notifications as read.
 *
 * @param notificationIds - The IDs of the notifications to mark as read.
 */
export async function markAsRead(notificationIds: UUID[]): Promise<void> {
	return await notificationRepository().markAsRead(notificationIds);
}

/**
 * Marks all notifications as read for the specified user.
 *
 * @param userId - The unique identifier of the user whose notifications will be marked as read.
 */
export async function markAllAsRead(userId: UUID): Promise<void> {
	return await notificationRepository().markAllAsRead(userId);
}

/**
 * Archives the specified notifications.
 *
 * @param notificationIds - The IDs of the notifications to archive.
 */
export async function archiveNotifications(notificationIds: UUID[]): Promise<void> {
	return await notificationRepository().archive(notificationIds);
}

/**
 * Retrieves notification statistics for a specific user.
 *
 * @param userId - The unique identifier of the user whose notification statistics are requested.
 * @returns An object containing statistics related to the user's notifications.
 */
export async function getNotificationStats(userId: UUID): Promise<TNotificationStats> {
	return await notificationRepository().getStats(userId);
}

export const notificationService = {
	createNotification,
	getUserNotifications,
	markAsRead,
	markAllAsRead,
	archiveNotifications,
	getNotificationStats,
};
