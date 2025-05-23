'use server';

import { workspaceRepository } from '@/api/repositories/workspace-repository';
import { getCurrentUser } from '@/modules/authenticatie/server/queries/auth';

export async function getUserWorkspaces() {
	try {
		const user = await getCurrentUser();

		if (!user) {
			throw new Error('Unauthorized');
		}

		return await workspaceRepository.getUserWorkspaces(user.id);
	} catch (error) {
		console.error('Error fetching user workspaces:', error);
		throw error;
	}
}
