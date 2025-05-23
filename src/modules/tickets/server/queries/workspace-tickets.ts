'use server';

import { ticketRepository } from '@/api/repositories/ticket-repository';
import { getCurrentUser } from '@/modules/authenticatie/server/queries/auth';

export async function getWorkspaceTickets(
	workspaceId: string,
	options: {
		page?: number;
		limit?: number;
		status?: string[];
		assigneeId?: string;
		priority?: string[];
		sortBy?: string;
		sortDirection?: 'asc' | 'desc';
	} = {}
) {
	try {
		const user = await getCurrentUser();

		if (!user) {
			throw new Error('Unauthorized');
		}

		return await ticketRepository.getWorkspaceTickets(workspaceId, options);
	} catch (error) {
		console.error('Error fetching workspace tickets:', error);
		throw error;
	}
}
