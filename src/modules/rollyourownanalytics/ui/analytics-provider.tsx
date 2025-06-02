'use client';

import { TTrackingContext, TAnalyticsConfig } from '@/modules/rollyourownanalytics/types';
import { getSessionId, getVisitorId } from '@/modules/rollyourownanalytics/utilities';
import { createContext, useContext, useCallback } from 'react';

// Client-side API function
async function trackEvent(data: any) {
	try {
		const response = await fetch('/api/analytics/track', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error('Failed to track event:', error);
		throw error;
	}
}

const AnalyticsContext = createContext<TTrackingContext | null>(null);

type TProps = {
	children: React.ReactNode;
	config: TAnalyticsConfig;
};

export function AnalyticsProvider({ children, config }: TProps) {
	const trackingContext: TTrackingContext = {
		projectId: config.projectId,
		sessionId: getSessionId(),
		visitorId: getVisitorId(),
		config,
	};

	return (
		<AnalyticsContext.Provider value={trackingContext}>{children}</AnalyticsContext.Provider>
	);
}

export function useAnalytics() {
	const context = useContext(AnalyticsContext);

	if (!context) {
		throw new Error('useAnalytics must be used within an AnalyticsProvider');
	}

	const trackEventAction = useCallback(
		(type: string, data?: Record<string, any>) => {
			trackEvent({
				projectId: context.projectId,
				sessionId: context.sessionId,
				type: type as any,
				name: data?.name || type,
				url: window.location.href,
				pathname: window.location.pathname,
				title: document.title,
				metadata: data,
			}).catch((error) => {
				if (context.config.debug) {
					console.error('Failed to track custom event:', error);
				}
			});
		},
		[context]
	);

	const trackCustomEvent = useCallback(
		(eventName: string, properties?: Record<string, any>) => {
			trackEventAction('custom', { name: eventName, ...properties });
		},
		[trackEventAction]
	);

	const trackConversion = useCallback(
		(goalName: string, value?: number) => {
			trackEventAction('conversion', { name: goalName, value });
		},
		[trackEventAction]
	);

	return {
		trackEvent: trackEventAction,
		trackCustomEvent,
		trackConversion,
		projectId: context.projectId,
		sessionId: context.sessionId,
		visitorId: context.visitorId,
	};
}
