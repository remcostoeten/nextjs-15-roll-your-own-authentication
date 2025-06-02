'use server';

import { analyticsDb } from '../db/connection';
import { analyticsEvents } from '../schemas/schema-analytics';
import { eq, and, desc } from 'drizzle-orm';

/**
 * Records exit data for a user's pageview event in the analytics database.
 *
 * Updates the most recent "pageview" event for the specified project, session, and URL with the provided duration, scroll depth, and marks it as an exit page.
 *
 * @param data - Contains the project ID, session ID, URL, duration of the visit, and scroll depth reached.
 * @returns An object indicating success, or failure with an error message if the operation could not be completed.
 */
export async function trackPageLeave(data: {
	projectId: string;
	sessionId: string;
	url: string;
	duration: number;
	scrollDepth: number;
}) {
	try {
		const pageviewEvent = await analyticsDb
			.select()
			.from(analyticsEvents)
			.where(
				and(
					eq(analyticsEvents.projectId, data.projectId),
					eq(analyticsEvents.sessionId, data.sessionId),
					eq(analyticsEvents.url, data.url),
					eq(analyticsEvents.type, 'pageview')
				)
			)
			.orderBy(desc(analyticsEvents.timestamp))
			.get();

		if (pageviewEvent) {
			await analyticsDb
				.update(analyticsEvents)
				.set({
					duration: data.duration,
					scrollDepth: data.scrollDepth,
					exitPage: true,
				})
				.where(eq(analyticsEvents.id, pageviewEvent.id));
		}

		return { success: true };
	} catch (error) {
		console.error('Error tracking page leave:', error);
		return { success: false, error: 'Failed to track page leave' };
	}
}
