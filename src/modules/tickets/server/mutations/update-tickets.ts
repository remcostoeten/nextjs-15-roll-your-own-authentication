'use server';

import { ticketRepository } from '@/api/repositories/ticket-repository';
import { getCurrentUser } from '@/modules/authenticatie/server/queries/auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const updateTicketSchema = z.object({
	ticketId: z.string().uuid(),
	title: z.string().min(1, 'Title is required').optional(),
	description: z.string().optional(),
	status: z.string().optional(),
	priority: z.string().optional(),
	assigneeId: z.string().uuid().nullable().optional(),
	dueDate: z
		.string()
		.nullable()
		.optional()
		.transform((val) => (val ? new Date(val) : null)),
	estimatedHours: z.number().nullable().optional(),
	labels: z.array(z.string()).optional(),
});

export async function updateTicket(formData: FormData | Record<string, any>) {
	try {
		const user = await getCurrentUser();

		if (!user) {
			throw new Error('Unauthorized');
		}

		// Parse and validate the input
		const data =
			formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData;

		// Handle labels if they come as a string
		if (typeof data.labels === 'string') {
			try {
				data.labels = JSON.parse(data.labels);
			} catch {
				data.labels = data.labels.split(',').map((label: string) => label.trim());
			}
		}

		const validatedData = updateTicketSchema.parse({
			...data,
			estimatedHours: data.estimatedHours ? Number(data.estimatedHours) : null,
		});

		const { ticketId, ...updateData } = validatedData;

		// Update the ticket
		const ticket = await ticketRepository.updateTicket(ticketId, user.id, updateData);

		// Get the workspace ID for revalidation
		const ticketDetails = await ticketRepository.getTicketById(ticketId);
		const workspaceId = ticketDetails?.ticket.workspaceId;

		// Revalidate the ticket page and workspace tickets page
		revalidatePath(`/workspace/${workspaceId}/tickets/${ticketId}`);
		revalidatePath(`/workspace/${workspaceId}/tickets`);

		return { success: true, ticket };
	} catch (error) {
		console.error('Error updating ticket:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to update ticket',
		};
	}
}
