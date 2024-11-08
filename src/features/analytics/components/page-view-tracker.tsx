'use client'

import { getFeatureConfig } from '@/core/config/FEATURE_CONFIG'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const PAGEVIEW_TIMEOUT = 30 * 60 * 1000 // 30 minutes in milliseconds

export default function PageViewTracker() {
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const config = getFeatureConfig()

	useEffect(() => {
		const trackPageView = async () => {
			try {
				const domain = window.location.hostname

				// Skip tracking if analytics disabled
				if (!config.analytics.enabled) return

				// Skip localhost unless explicitly enabled
				if (
					domain === 'localhost' &&
					!config.analytics.trackLocalhost
				) {
					return
				}

				// Create a unique key for this page view
				const viewKey = `pageview_${domain}_${pathname}`

				// Check if we've recently tracked this page
				const lastView = localStorage.getItem(viewKey)
				const currentTime = Date.now()

				if (lastView) {
					const timeSinceLastView = currentTime - parseInt(lastView)
					if (timeSinceLastView < PAGEVIEW_TIMEOUT) {
						return
					}
				}

				const response = await fetch('/api/analytics/page-view', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						pathname,
						domain,
						referrer: document.referrer,
						userAgent: navigator.userAgent
					})
				})

				if (!response.ok) {
					throw new Error('Failed to track page view')
				}

				localStorage.setItem(viewKey, currentTime.toString())
			} catch (error) {
				console.error('Failed to track page view:', error)
			}
		}

		trackPageView()
	}, [
		pathname,
		searchParams,
		config.analytics.enabled,
		config.analytics.trackLocalhost
	])

	return null
}
