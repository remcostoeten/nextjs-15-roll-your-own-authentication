'use server';

import { analyticsDb } from '../db/connection';
import { analyticsProjects } from '../schemas/schema-analytics';
import { eq } from 'drizzle-orm';

export async function updateProject(
	projectId: string,
	data: {
		name?: string;
		domain?: string;
		isActive?: boolean;
		settings?: Record<string, any>;
	}
) {
	try {
		const updates = {
			...data,
			updatedAt: new Date(),
		};

		await analyticsDb
			.update(analyticsProjects)
			.set(updates)
			.where(eq(analyticsProjects.id, projectId));

		return { success: true };
	} catch (error) {
		console.error('Error updating project:', error);
		return { success: false, error: 'Failed to update project' };
	}
}
