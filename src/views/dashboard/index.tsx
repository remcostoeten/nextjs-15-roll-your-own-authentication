'use client'

import React from 'react'
import { useAuth } from '@/modules/authentication/hooks/use-auth'
import { useUserMetrics } from '@/modules/user-metrics/hooks'
import { useRouter } from 'next/navigation'

export default function DashboardView() {
	const { user, isLoading, logout } = useAuth()
	const metrics = useUserMetrics()
	const router = useRouter()

	React.useEffect(() => {
		if (!isLoading && !user) {
			router.push('/login?callbackUrl=/dashboard')
		}
	}, [user, isLoading, router])

	const handleLogout = async () => {
		try {
			await logout()
			router.push('/')
		} catch (error) {
			console.error('Logout failed:', error)
		}
	}

	if (isLoading || metrics.isLoading) {
		return (
			<div className="min-h-screen bg-[#000000] flex items-center justify-center">
				<div className="w-6 h-6 border-t-2 border-primary animate-spin rounded-full" />
			</div>
		)
	}

	if (!user) {
		return (
			<div className="min-h-screen bg-[#000000] flex items-center justify-center">
				<div className="w-6 h-6 border-t-2 border-primary animate-spin rounded-full" />
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-[#000000] text-white py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<div className="flex justify-between items-center mb-12">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
						Dashboard
					</h1>
					<button
						onClick={handleLogout}
						className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors"
					>
						Sign out →
					</button>
				</div>

				{/* User Profile Card */}
				<div className="grid gap-6 mb-8 grid-cols-1 lg:grid-cols-3">
					<div className="lg:col-span-2 bg-[#0A0A0A] rounded-xl border border-[#1a1a1a] p-6 backdrop-blur-xl">
						<div className="flex items-center space-x-4 mb-6">
							<div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center">
								<span className="text-primary text-lg font-semibold">
									{user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || '?'}
								</span>
							</div>
							<div>
								<h2 className="text-xl font-medium text-white">
									{user?.firstName && user?.lastName
										? `${user.firstName} ${user.lastName}`
										: user?.email?.split('@')[0] || 'User'}
								</h2>
								<p className="text-sm text-neutral-500">{user?.email}</p>
							</div>
						</div>
						<div className="grid grid-cols-3 gap-4 border-t border-[#1a1a1a] pt-6">
							<div>
								<p className="text-sm text-neutral-500 mb-1">Account Status</p>
								<p className="text-white flex items-center">
									<span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
									Active
								</p>
							</div>
							<div>
								<p className="text-sm text-neutral-500 mb-1">Role</p>
								<p className="text-white flex items-center">
									<span className={`w-1.5 h-1.5 rounded-full ${user?.role === 'admin' ? 'bg-purple-500' : 'bg-blue-500'} mr-2`}></span>
									{user?.role === 'admin' ? 'Administrator' : 'User'}
								</p>
							</div>
							<div>
								<p className="text-sm text-neutral-500 mb-1">User ID</p>
								<p className="text-neutral-300 font-mono text-xs truncate">{user?.id || 'N/A'}</p>
							</div>
						</div>
					</div>

					<div className="bg-[#0A0A0A] rounded-xl border border-[#1a1a1a] p-6">
						<h3 className="text-sm font-medium text-neutral-500 mb-4">Quick Stats</h3>
						<div className="space-y-4">
							<div>
								<div className="flex justify-between items-center mb-2">
									<span className="text-sm text-neutral-400">Login Streak</span>
									<span className="text-white font-medium">{metrics.loginStreak} days</span>
								</div>
								<div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
									<div
										className="h-full bg-primary rounded-full"
										style={{ width: `${Math.min((metrics.loginStreak / 30) * 100, 100)}%` }}
									/>
								</div>
							</div>
							<div>
								<p className="text-sm text-neutral-400 mb-1">Account Age</p>
								<p className="text-white font-medium">{metrics.accountAge}</p>
							</div>
							<div>
								<p className="text-sm text-neutral-400 mb-1">Last Login</p>
								<p className="text-white font-medium">{metrics.lastLoginFormatted}</p>
							</div>
						</div>
					</div>
				</div>

				{/* Location & Device Info */}
				<div className="grid gap-6 mb-8 grid-cols-1 lg:grid-cols-2">
					<div className="bg-[#0A0A0A] rounded-xl border border-[#1a1a1a] p-6">
						<h3 className="text-sm font-medium text-neutral-500 mb-4">Current Session</h3>
						<div className="grid grid-cols-2 gap-6">
							<div>
								<div className="flex items-center space-x-2 mb-4">
									<div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
										<svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
										</svg>
									</div>
									<div>
										<p className="text-xs text-neutral-500">Location</p>
										<p className="text-sm text-white">{metrics.currentLocation?.city}, {metrics.currentLocation?.country}</p>
									</div>
								</div>
								<div className="flex items-center space-x-2">
									<div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
										<svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
									</div>
									<div>
										<p className="text-xs text-neutral-500">Timezone</p>
										<p className="text-sm text-white">{metrics.currentLocation?.timezone}</p>
									</div>
								</div>
							</div>
							<div>
								<div className="flex items-center space-x-2 mb-4">
									<div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
										<svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
										</svg>
									</div>
									<div>
										<p className="text-xs text-neutral-500">Device</p>
										<p className="text-sm text-white">{metrics.device?.os} - {metrics.device?.browser}</p>
									</div>
								</div>
								<div className="flex items-center space-x-2">
									<div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
										<svg className="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
										</svg>
									</div>
									<div>
										<p className="text-xs text-neutral-500">Resolution</p>
										<p className="text-sm text-white">{metrics.device?.screenResolution}</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="bg-[#0A0A0A] rounded-xl border border-[#1a1a1a] p-6">
						<h3 className="text-sm font-medium text-neutral-500 mb-4">Navigation Insights</h3>
						<div className="space-y-4">
							<div>
								<div className="flex justify-between items-center mb-2">
									<span className="text-sm text-neutral-400">Average Time on Site</span>
									<span className="text-white font-medium">{Math.round(metrics.navigation.averageTimeOnSite / 60)} min</span>
								</div>
								<div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
									<div
										className="h-full bg-indigo-500 rounded-full"
										style={{ width: `${Math.min((metrics.navigation.averageTimeOnSite / 3600) * 100, 100)}%` }}
									/>
								</div>
							</div>
							<div>
								<p className="text-sm text-neutral-400 mb-2">Most Visited Pages</p>
								<div className="space-y-2">
									{metrics.navigation.mostVisitedPages.slice(0, 3).map((page, index) => (
										<div key={index} className="flex justify-between items-center">
											<span className="text-sm text-white truncate max-w-[200px]">{page.path}</span>
											<span className="text-xs text-neutral-500">{page.count} visits</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Error Tracking */}
				{metrics.recentErrors.length > 0 && (
					<div className="mb-8 bg-[#0A0A0A] rounded-xl border border-[#1a1a1a] p-6">
						<h3 className="text-sm font-medium text-neutral-500 mb-4">Recent Issues</h3>
						<div className="space-y-4">
							{metrics.recentErrors.slice(0, 3).map((error, index) => (
								<div key={index} className="flex items-start space-x-3">
									<div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center mt-1">
										<svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
										</svg>
									</div>
									<div>
										<p className="text-sm text-white">{error.message}</p>
										<p className="text-xs text-neutral-500 mt-1">
											{error.path} • {new Date(error.timestamp).toLocaleTimeString()}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Recent Activity with enhanced details */}
				<div className="bg-[#0A0A0A] rounded-xl border border-[#1a1a1a] p-6">
					<div className="flex justify-between items-center mb-6">
						<h3 className="text-sm font-medium text-neutral-500">Activity Timeline</h3>
						<div className="flex space-x-2">
							{['auth', 'navigation', 'error', 'system'].map((type) => (
								<span key={type} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-800 text-neutral-400">
									{type}
								</span>
							))}
						</div>
					</div>
					<div className="space-y-6">
						{metrics.activityLog.length > 0 ? (
							metrics.activityLog.map((activity) => (
								<div
									key={activity.id}
									className="relative pl-6 before:absolute before:left-0 before:top-[22px] before:bottom-[-24px] before:w-[1px] before:bg-[#1a1a1a]"
								>
									<div className={`absolute left-[-2px] top-[18px] w-[5px] h-[5px] rounded-full ring-4 ring-black
										${activity.type === 'auth' ? 'bg-green-500' :
											activity.type === 'error' ? 'bg-red-500' :
												activity.type === 'navigation' ? 'bg-blue-500' : 'bg-purple-500'
										}`}
									/>
									<div className="flex items-center space-x-2 mb-1">
										<p className="text-xs text-neutral-500">
											{activity.timestamp}
										</p>
										{activity.location && (
											<p className="text-xs text-neutral-600">
												• {activity.location.city}, {activity.location.country}
											</p>
										)}
									</div>
									<p className="text-sm text-white">
										{activity.action}
									</p>
									{activity.details && (
										<div className="mt-2 text-xs font-mono bg-black/30 rounded-md p-2 text-neutral-400">
											{activity.details}
										</div>
									)}
									{activity.device && (
										<p className="text-xs text-neutral-600 mt-1">
											{activity.device.browser} on {activity.device.os}
										</p>
									)}
								</div>
							))
						) : (
							<div className="text-center py-8">
								<p className="text-neutral-500 text-sm">
									No recent activity to display
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
