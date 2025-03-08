'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/modules/authentication/hooks/use-auth'

type UserMetrics = {
	loginStreak: number
	accountAge: string
	lastLogin: string
	activityLog: Array<{
		timestamp: string
		action: string
		date: Date
	}>
	isLoading: boolean
}

/**
 * Hook to handle user metrics data
 * This follows the modular architecture by keeping dashboard-specific logic
 * in the dashboard module
 */
export function useUserMetrics(): UserMetrics {
	const { user } = useAuth()
	const [metrics, setMetrics] = useState<UserMetrics>({
		loginStreak: 0,
		accountAge: '',
		lastLogin: '',
		activityLog: [],
		isLoading: true,
	})

	useEffect(() => {
		if (!user) {
			setMetrics((prev) => ({ ...prev, isLoading: false }))
			return
		}

		// In a real app, you would fetch this data from your API
		// This is a mock implementation
		const fetchMetrics = async () => {
			try {
				// Simulate API call
				await new Promise((resolve) => setTimeout(resolve, 500))

				// Mock data - in a real app, this would come from the backend
				setMetrics({
					loginStreak: 3,
					accountAge: '14 days',
					lastLogin: 'Today',
					activityLog: [
						{
							timestamp: 'Just now',
							action: 'Logged in to dashboard',
							date: new Date(),
						},
						{
							timestamp: 'Yesterday',
							action: 'Updated profile information',
							date: new Date(Date.now() - 24 * 60 * 60 * 1000),
						},
					],
					isLoading: false,
				})
			} catch (error) {
				console.error('Error fetching user metrics:', error)
				setMetrics((prev) => ({ ...prev, isLoading: false }))
			}
		}

		fetchMetrics()
	}, [user])

	return metrics
}
