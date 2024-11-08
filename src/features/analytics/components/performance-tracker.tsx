'use client'

import { useEffect } from 'react'

type PerformanceMetrics = {
	timeToFirstByte: number
	firstContentfulPaint: number
	domInteractive: number
	domComplete: number
	loadEventEnd: number
}

type NavigationTiming = {
	navigationStart: number
	unloadEventStart: number
	unloadEventEnd: number
	redirectStart: number
	redirectEnd: number
	fetchStart: number
	domainLookupStart: number
	domainLookupEnd: number
	connectStart: number
	connectEnd: number
	secureConnectionStart: number
	requestStart: number
	responseStart: number
	responseEnd: number
	domLoading: number
	domInteractive: number
	domContentLoadedEventStart: number
	domContentLoadedEventEnd: number
	domComplete: number
	loadEventStart: number
	loadEventEnd: number
}

export function PerformanceTracker() {
	useEffect(() => {
		const collectMetrics = (): PerformanceMetrics => {
			const timing = performance.timing as unknown as NavigationTiming

			return {
				timeToFirstByte: timing.responseStart - timing.navigationStart,
				firstContentfulPaint:
					performance.getEntriesByType('paint')[0]?.startTime || 0,
				domInteractive: timing.domInteractive - timing.navigationStart,
				domComplete: timing.domComplete - timing.navigationStart,
				loadEventEnd: timing.loadEventEnd - timing.navigationStart
			}
		}

		// Use the metrics
		const metrics = collectMetrics()
		console.log('Performance metrics:', metrics)
	}, [])

	return <></>
}
