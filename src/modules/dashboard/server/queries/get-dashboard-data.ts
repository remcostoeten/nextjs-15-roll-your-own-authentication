'use server';

import { db } from '@/api/connection';
import { notes, tickets, users, workspaceMembers } from '@/api/db/schema';
import { getCurrentUser } from '@/modules/authenticatie/server/queries/auth';
import { subDays } from 'date-fns';
import { and, desc, eq, gte, sql } from 'drizzle-orm';

export async function getDashboardData(workspaceId: string) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			throw new Error('Unauthorized');
		}

		const now = new Date();
		const thirtyDaysAgo = subDays(now, 30);

		// Get activity data (notes and tickets counts per day)
		const activityData = {
			notes: await db
				.select({
					date: sql<string>`DATE(${notes.createdAt})`,
					count: sql<number>`COUNT(*)`,
				})
				.from(notes)
				.where(and(eq(notes.workspaceId, workspaceId), gte(notes.createdAt, thirtyDaysAgo)))
				.groupBy(sql`DATE(${notes.createdAt})`)
				.orderBy(sql`DATE(${notes.createdAt})`),

			tickets: await db
				.select({
					date: sql<string>`DATE(${tickets.createdAt})`,
					count: sql<number>`COUNT(*)`,
				})
				.from(tickets)
				.where(
					and(eq(tickets.workspaceId, workspaceId), gte(tickets.createdAt, thirtyDaysAgo))
				)
				.groupBy(sql`DATE(${tickets.createdAt})`)
				.orderBy(sql`DATE(${tickets.createdAt})`),
		};

		// Get top contributors
		const contributors = await db
			.select({
				userId: users.id,
				name: users.name,
				avatar: users.avatar,
				count: sql<number>`
          COUNT(DISTINCT CASE WHEN ${notes.id} IS NOT NULL THEN ${notes.id} END) +
          COUNT(DISTINCT CASE WHEN ${tickets.id} IS NOT NULL THEN ${tickets.id} END)
        `,
			})
			.from(workspaceMembers)
			.leftJoin(users, eq(workspaceMembers.userId, users.id))
			.leftJoin(
				notes,
				and(
					eq(notes.workspaceId, workspaceMembers.workspaceId),
					eq(notes.createdBy, users.id),
					gte(notes.createdAt, thirtyDaysAgo)
				)
			)
			.leftJoin(
				tickets,
				and(
					eq(tickets.workspaceId, workspaceMembers.workspaceId),
					eq(tickets.reporterId, users.id),
					gte(tickets.createdAt, thirtyDaysAgo)
				)
			)
			.where(eq(workspaceMembers.workspaceId, workspaceId))
			.groupBy(users.id, users.name, users.avatar)
			.orderBy(desc(sql`count`))
			.limit(5);

		// Get recent activity
		const recentActivity = await Promise.all([
			// Get recent notes
			db
				.select({
					id: notes.id,
					type: sql<'note'>`'note'`,
					title: notes.title,
					createdAt: notes.createdAt,
					createdBy: users.name,
					avatar: users.avatar,
				})
				.from(notes)
				.leftJoin(users, eq(notes.createdBy, users.id))
				.where(eq(notes.workspaceId, workspaceId))
				.orderBy(desc(notes.createdAt))
				.limit(5),

			// Get recent tickets
			db
				.select({
					id: tickets.id,
					type: sql<'ticket'>`'ticket'`,
					title: tickets.title,
					createdAt: tickets.createdAt,
					createdBy: users.name,
					avatar: users.avatar,
				})
				.from(tickets)
				.leftJoin(users, eq(tickets.reporterId, users.id))
				.where(eq(tickets.workspaceId, workspaceId))
				.orderBy(desc(tickets.createdAt))
				.limit(5),
		]).then(([notes, tickets]) =>
			[...notes, ...tickets]
				.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
				.slice(0, 5)
		);

		// Get stats
		const stats = await Promise.all([
			// Total notes
			db
				.select({ count: sql<number>`COUNT(*)` })
				.from(notes)
				.where(eq(notes.workspaceId, workspaceId))
				.then((result) => result[0].count),

			// Total tickets
			db
				.select({ count: sql<number>`COUNT(*)` })
				.from(tickets)
				.where(eq(tickets.workspaceId, workspaceId))
				.then((result) => result[0].count),

			// Active users (users who created something in the last 30 days)
			db
				.select({ count: sql<number>`COUNT(DISTINCT ${workspaceMembers.userId})` })
				.from(workspaceMembers)
				.where(eq(workspaceMembers.workspaceId, workspaceId))
				.then((result) => result[0].count),

			// Activity rate (percentage of days with activity in the last 30 days)
			db
				.select({
					count: sql<number>`
          COUNT(DISTINCT DATE(COALESCE(${notes.createdAt}, ${tickets.createdAt}))) * 100.0 / 30
        `,
				})
				.from(notes)
				.fullJoin(
					tickets,
					and(
						eq(tickets.workspaceId, notes.workspaceId),
						sql`DATE(${tickets.createdAt}) = DATE(${notes.createdAt})`
					)
				)
				.where(and(eq(notes.workspaceId, workspaceId), gte(notes.createdAt, thirtyDaysAgo)))
				.then((result) => Math.round(result[0].count)),
		]);

		return {
			success: true,
			data: {
				activityData,
				contributors,
				activityFeed: recentActivity,
				stats: {
					totalNotes: stats[0],
					totalTickets: stats[1],
					activeUsers: stats[2],
					activityRate: stats[3],
				},
			},
		};
	} catch (error) {
		console.error('Error fetching dashboard data:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to fetch dashboard data',
		};
	}
}
