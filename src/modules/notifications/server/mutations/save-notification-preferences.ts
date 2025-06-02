'use server';

import { getSession } from '@/modules/authenticatie/helpers/session';
import { TBaseMutationResponse } from '@/shared/types/base';
import { asUUID } from '@/shared/types/common';
import { TNotificationPreferencesInput } from '../../types';
import { notificationRepository } from '../repositories/notification-repository';

/**
 * Saves the current user's notification preferences.
 *
 * Attempts to persist the provided notification preferences for the authenticated user. Returns a success or failure response based on the outcome.
 *
 * @param preferences - The notification preferences to save for the user.
 * @returns A mutation response indicating whether the preferences were saved successfully.
 */
export async function saveNotificationPreferences(
	preferences: TNotificationPreferencesInput
): Promise<TBaseMutationResponse<void>> {
	try {
		const session = await getSession();

		if (!session?.id) {
			return { success: false, error: 'Unauthorized' };
		}

		// Save preferences to dedicated preferences table
		await notificationRepository().savePreferences(asUUID(session.id), preferences);

		return {
			success: true,
			message: 'Notification preferences saved successfully',
		};
	} catch (error) {
		console.error('Error saving notification preferences:', error);
		return { success: false, error: 'Failed to save notification preferences' };
	}
}
