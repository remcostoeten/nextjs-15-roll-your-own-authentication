'use server';

import { activityRepository } from '@/api/db/activity-repository';
import { getCurrentUser } from '@/modules/authenticatie/server/queries/auth';

export async function getActivityFeed(workspaceId: string, limit = 10) {
	try {
		const user = await getCurrentUser();

		if (!user) {
			throw new Error('Unauthorized');
		}

		return await activityRepository.getActivityFeed(workspaceId, limit);
	} catch (error) {
		console.error('Error fetching activity feed:', error);
		throw error;
	}
}
