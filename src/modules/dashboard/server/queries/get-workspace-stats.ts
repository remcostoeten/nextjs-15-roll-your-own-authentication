'use server';

import { activityRepository } from '@/api/repositories/activity-repository';
import { getCurrentUser } from '@/modules/authenticatie/server/queries/auth';

export async function getWorkspaceStats(workspaceId: string) {
	try {
		const user = await getCurrentUser();

		if (!user) {
			throw new Error('Unauthorized');
		}

		return await activityRepository.getWorkspaceStats(workspaceId);
	} catch (error) {
		console.error('Error fetching workspace stats:', error);
		throw error;
	}
}
