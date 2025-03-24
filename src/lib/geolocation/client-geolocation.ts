'use client'

import { useState, useEffect } from 'react'

export interface GeolocationData {
	country: string
	city: string
	region: string
	latitude?: number
	longitude?: number
	ip?: string
	timezone?: string
	isp?: string
}

/**
 * Hook to get user's geolocation data
 */
export function useGeolocation() {
	const [geolocation, setGeolocation] = useState<GeolocationData | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		async function getGeolocation() {
			try {
				setLoading(true)

				// For simplicity, we'll use a fallback
				setGeolocation({
					country: 'Unknown',
					city: 'Unknown',
					region: 'Unknown',
				})
			} catch (err) {
				console.error('Error getting geolocation:', err)
				setError(err instanceof Error ? err.message : 'Failed to get geolocation')

				// Set fallback data
				setGeolocation({
					country: 'Unknown',
					city: 'Unknown',
					region: 'Unknown',
				})
			} finally {
				setLoading(false)
			}
		}

		getGeolocation()
	}, [])

	return { geolocation, loading, error }
}

/**
 * Function to manually clear the geolocation cache
 */
export function clearGeolocationCache() {
	if (typeof window !== 'undefined') {
		localStorage.removeItem('geolocation-data')
		localStorage.removeItem('geolocation-timestamp')
	}
}
