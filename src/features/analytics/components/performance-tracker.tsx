'use client'

import { useEffect } from 'react'

export function PerformanceTracker() {
	useEffect(() => {
		const trackPerformance = () => {
			const performance = window.performance
			const timing = performance.timing

			const metrics = {
				dns: timing.domainLookupEnd - timing.domainLookupStart,
				tcp: timing.connectEnd - timing.connectStart,
				ttfb: timing.responseStart - timing.requestStart,
				download: timing.responseEnd - timing.responseStart,
				domLoad:
					timing.domContentLoadedEventEnd - timing.navigationStart,
				fullLoad: timing.loadEventEnd - timing.navigationStart,
				// Memory usage if available
				memory: (performance as any).memory
					? {
							usedJSHeapSize: (performance as any).memory
								.usedJSHeapSize,
							totalJSHeapSize: (performance as any).memory
								.totalJSHeapSize
						}
					: null,
				// Network info if available
				connection: navigator.connection
					? {
							effectiveType: (navigator.connection as any)
								.effectiveType,
							downlink: (navigator.connection as any).downlink,
							rtt: (navigator.connection as any).rtt
						}
					: null
			}

			fetch('/api/analytics/performance', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(metrics)
			})
		}

		window.addEventListener('load', trackPerformance)
		return () => window.removeEventListener('load', trackPerformance)
	}, [])

	return null
}
