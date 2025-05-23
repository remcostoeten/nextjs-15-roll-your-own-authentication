import { z } from 'zod';

export const dashboardDataSchema = z.object({
	activityData: z.object({
		notes: z.array(
			z.object({
				date: z.string(),
				count: z.number(),
			})
		),
		tickets: z.array(
			z.object({
				date: z.string(),
				count: z.number(),
			})
		),
	}),
	contributors: z.array(
		z.object({
			userId: z.string(),
			name: z.string().nullable(),
			avatar: z.string().nullable(),
			count: z.number(),
		})
	),
	activityFeed: z.array(
		z.object({
			id: z.string(),
			type: z.enum(['note', 'ticket']),
			title: z.string(),
			createdAt: z.date(),
			createdBy: z.string(),
			avatar: z.string().nullable(),
		})
	),
	stats: z.object({
		totalNotes: z.number(),
		totalTickets: z.number(),
		activeUsers: z.number(),
		activityRate: z.number(),
	}),
});

export type TDashboardData = z.infer<typeof dashboardDataSchema>;
