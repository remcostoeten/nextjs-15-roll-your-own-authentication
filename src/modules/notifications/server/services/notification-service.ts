import { UUID } from '@/shared/types/common';
import {
	TCreateNotificationInput,
	TGetNotificationsOptions,
	TNotificationStats,
	TNotificationWithActor,
} from '../../types';
import { notificationRepository } from '../repositories/notification-repository';

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

export async function getUserNotifications(
	userId: UUID,
	options: TGetNotificationsOptions = {}
): Promise<TNotificationWithActor[]> {
	return await notificationRepository().findByUserId(userId, options);
}

export async function markAsRead(notificationIds: UUID[]): Promise<void> {
	return await notificationRepository().markAsRead(notificationIds);
}

export async function markAllAsRead(userId: UUID): Promise<void> {
	return await notificationRepository().markAllAsRead(userId);
}

export async function archiveNotifications(notificationIds: UUID[]): Promise<void> {
	return await notificationRepository().archive(notificationIds);
}

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
