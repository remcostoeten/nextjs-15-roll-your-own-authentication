'use client'

import { useEffect } from 'react'

type AnalyticsEvent = {
	name: string
	properties: Record<string, string | number | boolean>
	timestamp: Date
}

type EventTrackerProps = {
	onEvent: (event: AnalyticsEvent) => void
}

export function EventTracker({ onEvent }: EventTrackerProps) {
	useEffect(() => {
		const trackEvent = (
			name: string,
			properties: Record<string, string | number | boolean>
		) => {
			onEvent({
				name,
				properties,
				timestamp: new Date()
			})
		}

		// Example usage
		trackEvent('page_view', { path: window.location.pathname })
	}, [onEvent])

	return null
}
