'use server';

import { ticketRepository } from '@/api/repositories/ticket-repository';
import { getCurrentUser } from '@/modules/authenticatie/server/queries/auth';
export async function getTicket(ticketId: string) {
	try {
		const user = await getCurrentUser();

		if (!user) {
			throw new Error('Unauthorized');
		}

		return await ticketRepository.getTicketById(ticketId);
	} catch (error) {
		console.error('Error fetching ticket:', error);
		throw error;
	}
}
