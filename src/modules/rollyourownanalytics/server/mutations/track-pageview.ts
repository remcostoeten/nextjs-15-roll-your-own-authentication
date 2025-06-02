'use server';

import type { TAnalyticsEvent } from '../../types';
import { trackEvent } from './track-event';

/**
 * Tracks a pageview analytics event with the provided session, visitor, and page information.
 *
 * Constructs a standardized pageview event and forwards it for analytics tracking.
 *
 * @param data - Object containing project, session, visitor, and page details to be logged.
 * @returns A promise resolving to the result of the analytics event tracking.
 */
export async function trackPageview(data: {
	projectId: string;
	sessionId: string;
	visitorId: string;
	url: string;
	title?: string;
	referrer?: string;
	device?: 'desktop' | 'mobile' | 'tablet';
	browser?: string;
	os?: string;
	screenWidth?: number;
	screenHeight?: number;
	viewportWidth?: number;
	viewportHeight?: number;
	language?: string;
}) {
	const eventData: Partial<TAnalyticsEvent> = {
		...data,
		type: 'pageview',
		metadata: { visitorId: data.visitorId },
	};

	return await trackEvent(eventData);
}
