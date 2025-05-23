'use server';

import { ticketRepository } from '@/api/repositories/ticket-repository';
import { getCurrentUser } from '@/modules/authenticatie/server/queries/auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const deleteTicketSchema = z.object({
	ticketId: z.string().uuid(),
	workspaceId: z.string().uuid(),
});

export async function deleteTicket(formData: FormData | Record<string, any>) {
	try {
		const user = await getCurrentUser();

		if (!user) {
			throw new Error('Unauthorized');
		}

		// Parse and validate the input
		const data =
			formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData;

		const validatedData = deleteTicketSchema.parse(data);

		// Delete the ticket
		await ticketRepository.deleteTicket(validatedData.ticketId);

		// Revalidate the workspace tickets page
		revalidatePath(`/workspace/${validatedData.workspaceId}/tickets`);

		return { success: true };
	} catch (error) {
		console.error('Error deleting ticket:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to delete ticket',
		};
	}
}
