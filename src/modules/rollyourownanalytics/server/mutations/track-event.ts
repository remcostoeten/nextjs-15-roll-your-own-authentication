'use server';

import { analyticsEvents, analyticsSessions } from '../schemas/schema-analytics';

import { headers } from 'next/headers';
import { eq, and } from 'drizzle-orm';
import type { TAnalyticsEvent } from '../../types';
import { analyticsDb } from '../db/connection';
import { getGeoLocation, parseUtmParams } from '../../utilities';

/**
 * Tracks an analytics event by enriching partial event data with request headers, geolocation, and UTM parameters, then stores it in the database.
 *
 * Constructs a complete analytics event, inserts it into the `analyticsEvents` table, and updates or creates the corresponding session record.
 *
 * @param eventData - Partial analytics event data to be tracked.
 * @returns An object indicating success with the event ID, or failure with an error message.
 */
export async function trackEvent(eventData: Partial<TAnalyticsEvent>) {
	try {
		const headersList = await headers();
		const request = new Request('http://localhost', {
			headers: headersList as any,
		});

		const userAgent = headersList.get('user-agent') || undefined;
		const geoLocation = await getGeoLocation(request);
		const utmParams = parseUtmParams(eventData.url || '');

		const event: TAnalyticsEvent = {
			id: crypto.randomUUID(),
			projectId: eventData.projectId!,
			sessionId: eventData.sessionId!,
			type: eventData.type || 'custom',
			name: eventData.name,
			url: eventData.url!,
			pathname: eventData.pathname || new URL(eventData.url!).pathname,
			referrer: eventData.referrer,
			title: eventData.title,
			userAgent,
			country: geoLocation.country,
			city: geoLocation.city,
			region: geoLocation.region,
			timezone: geoLocation.timezone,
			language: eventData.language,
			device: eventData.device,
			browser: eventData.browser,
			os: eventData.os,
			screenWidth: eventData.screenWidth,
			screenHeight: eventData.screenHeight,
			viewportWidth: eventData.viewportWidth,
			viewportHeight: eventData.viewportHeight,
			timestamp: new Date(),
			duration: eventData.duration,
			scrollDepth: eventData.scrollDepth,
			exitPage: eventData.exitPage,
			bounced: eventData.bounced,
			...utmParams,
			metadata: eventData.metadata,
		};

		await analyticsDb.insert(analyticsEvents).values(event);
		await updateSession(event);

		return { success: true, eventId: event.id };
	} catch (error) {
		console.error('Error tracking event:', error);
		return { success: false, error: 'Failed to track event' };
	}
}

/**
 * Updates or creates an analytics session record based on the provided event.
 *
 * If a session matching the event's session ID and project ID exists, updates its timestamps and increments the pageview or event count. Otherwise, creates a new session record initialized with details from the event.
 *
 * @param event - The analytics event used to update or create the session.
 */
async function updateSession(event: TAnalyticsEvent) {
	const existingSession = await analyticsDb
		.select()
		.from(analyticsSessions)
		.where(
			and(
				eq(analyticsSessions.id, event.sessionId),
				eq(analyticsSessions.projectId, event.projectId)
			)
		)
		.get();

	if (existingSession) {
		const updates: any = {
			endedAt: event.timestamp,
			updatedAt: new Date(),
		};

		if (event.type === 'pageview') {
			updates.pageviews = existingSession.pageviews + 1;
		} else {
			updates.events = existingSession.events + 1;
		}

		await analyticsDb
			.update(analyticsSessions)
			.set(updates)
			.where(eq(analyticsSessions.id, event.sessionId));
	} else {
		const session = {
			id: event.sessionId,
			projectId: event.projectId,
			visitorId: event.metadata?.visitorId || crypto.randomUUID(),
			userAgent: event.userAgent,
			country: event.country,
			city: event.city,
			region: event.region,
			timezone: event.timezone,
			language: event.language,
			device: event.device,
			browser: event.browser,
			os: event.os,
			referrer: event.referrer,
			utmSource: event.utmSource,
			utmMedium: event.utmMedium,
			utmCampaign: event.utmCampaign,
			utmTerm: event.utmTerm,
			utmContent: event.utmContent,
			startedAt: event.timestamp,
			endedAt: event.timestamp,
			pageviews: event.type === 'pageview' ? 1 : 0,
			events: event.type !== 'pageview' ? 1 : 0,
			bounced: false,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		await analyticsDb.insert(analyticsSessions).values(session);
	}
}
