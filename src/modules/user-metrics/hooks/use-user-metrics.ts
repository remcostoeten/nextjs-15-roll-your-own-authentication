'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/modules/authentication/hooks/use-auth'
import { getUserMetrics, getUserActivities } from '../api/queries'

type GeoLocation = {
	city: string
	country: string
	region: string
	timezone: string
	ip: string
}

type DeviceInfo = {
	browser: string
	os: string
	device: string
	screenResolution: string
}

type PageView = {
	path: string
	title: string
	referrer: string
	timeSpent: number
	timestamp: Date
}

type ErrorEvent = {
	message: string
	stack?: string
	path: string
	timestamp: Date
	error?: Error
}

type ActivityLog = {
	id: string
	userId: string
	action: string
	details?: string | null
	createdAt: Date
	timestamp: string
	location?: GeoLocation
	device?: DeviceInfo
	type: 'auth' | 'navigation' | 'error' | 'system'
}

type SessionMetrics = {
	totalSessions: number
	averageSessionDuration: number
	lastSession: {
		start: Date
		end: Date
		duration: number
	}
}

type NavigationMetrics = {
	mostVisitedPages: Array<{ path: string; count: number }>
	averageTimeOnSite: number
	bounceRate: number
	exitPages: Array<{ path: string; count: number }>
}

type UserMetricsData = {
	loginStreak: number
	accountAge: string
	lastLoginFormatted: string
	activityLog: ActivityLog[]
	isLoading: boolean
	error: string | null
	sessions: SessionMetrics
	navigation: NavigationMetrics
	currentLocation?: GeoLocation
	device?: DeviceInfo
	recentErrors: ErrorEvent[]
	pageViews: PageView[]
}

/**
 * Hook to fetch and manage user metrics data from the database
 */
export function useUserMetrics(): UserMetricsData {
	const { user, isAuthenticated } = useAuth()
	const [metrics, setMetrics] = useState<UserMetricsData>({
		loginStreak: 0,
		accountAge: '',
		lastLoginFormatted: '',
		activityLog: [],
		isLoading: true,
		error: null,
		sessions: {
			totalSessions: 0,
			averageSessionDuration: 0,
			lastSession: {
				start: new Date(),
				end: new Date(),
				duration: 0,
			},
		},
		navigation: {
			mostVisitedPages: [],
			averageTimeOnSite: 0,
			bounceRate: 0,
			exitPages: [],
		},
		recentErrors: [],
		pageViews: [],
	})

	// Track page views
	useEffect(() => {
		if (!user || !isAuthenticated) return

		const trackPageView = () => {
			const path = window.location.pathname
			const title = document.title
			const referrer = document.referrer

			setMetrics((prev) => ({
				...prev,
				pageViews: [
					...prev.pageViews,
					{
						path,
						title,
						referrer,
						timeSpent: 0,
						timestamp: new Date(),
					},
				],
			}))
		}

		trackPageView()
		window.addEventListener('popstate', trackPageView)

		return () => window.removeEventListener('popstate', trackPageView)
	}, [user, isAuthenticated])

	// Track errors
	useEffect(() => {
		if (!user || !isAuthenticated) return

		const handleError = (event: ErrorEvent) => {
			setMetrics((prev) => ({
				...prev,
				recentErrors: [
					...prev.recentErrors,
					{
						message: event.message,
						stack: event.error?.stack,
						path: window.location.pathname,
						timestamp: new Date(),
						error: event.error,
					},
				],
			}))
		}

		window.addEventListener('error', handleError as unknown as EventListener)

		return () => window.removeEventListener('error', handleError as unknown as EventListener)
	}, [user, isAuthenticated])

	// Get device info
	useEffect(() => {
		if (!user || !isAuthenticated) return

		const getDeviceInfo = (): DeviceInfo => {
			const ua = navigator.userAgent
			const screenRes = `${window.screen.width}x${window.screen.height}`

			return {
				browser: getBrowserInfo(ua),
				os: getOSInfo(ua),
				device: getDeviceType(ua),
				screenResolution: screenRes,
			}
		}

		setMetrics((prev) => ({
			...prev,
			device: getDeviceInfo(),
		}))
	}, [user, isAuthenticated])

	// Fetch main metrics data
	useEffect(() => {
		if (!user || !isAuthenticated) {
			setMetrics((prev) => ({ ...prev, isLoading: false }))
			return
		}

		const fetchData = async () => {
			try {
				const [metricsData, activities, geoData] = await Promise.all([
					getUserMetrics(user.id),
					getUserActivities(user.id),
					fetch('https://ipapi.co/json/').then((res) => res.json()),
				])

				setMetrics((prev) => ({
					...prev,
					loginStreak: metricsData.loginStreak || 0,
					accountAge: metricsData.accountAge,
					lastLoginFormatted: metricsData.lastLoginFormatted,
					activityLog: activities.map((activity) => ({
						...activity,
						type: activity.action.startsWith('auth_')
							? 'auth'
							: activity.action.startsWith('nav_')
								? 'navigation'
								: activity.action.startsWith('error_')
									? 'error'
									: 'system',
					})),
					currentLocation: {
						city: geoData.city,
						country: geoData.country_name,
						region: geoData.region,
						timezone: geoData.timezone,
						ip: geoData.ip,
					},
					isLoading: false,
					error: null,
				}))
			} catch (error) {
				console.error('Error fetching user metrics:', error)
				setMetrics((prev) => ({
					...prev,
					isLoading: false,
					error: error instanceof Error ? error.message : 'Failed to fetch metrics',
				}))
			}
		}

		fetchData()
	}, [user, isAuthenticated])

	return metrics
}

// Helper functions for device detection
function getBrowserInfo(ua: string): string {
	if (ua.includes('Firefox')) return 'Firefox'
	if (ua.includes('Chrome')) return 'Chrome'
	if (ua.includes('Safari')) return 'Safari'
	if (ua.includes('Edge')) return 'Edge'
	if (ua.includes('Opera')) return 'Opera'
	return 'Unknown'
}

function getOSInfo(ua: string): string {
	if (ua.includes('Windows')) return 'Windows'
	if (ua.includes('Mac')) return 'MacOS'
	if (ua.includes('Linux')) return 'Linux'
	if (ua.includes('Android')) return 'Android'
	if (ua.includes('iOS')) return 'iOS'
	return 'Unknown'
}

function getDeviceType(ua: string): string {
	if (ua.includes('Mobile')) return 'Mobile'
	if (ua.includes('Tablet')) return 'Tablet'
	return 'Desktop'
}
