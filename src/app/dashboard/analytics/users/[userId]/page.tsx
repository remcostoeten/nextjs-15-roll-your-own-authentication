'use client'

import { useEffect, useState } from 'react'

type PageProps = {
	params: {
		userId: string | string[]
	}
}

type UserAnalytics = {
	totalViews: number
	lastVisit: string | null
	topPages: Array<{
		pathname: string
		views: number
	}>
}

export default function UserAnalyticsPage({ params }: PageProps) {
	const userId = Array.isArray(params.userId)
		? params.userId[0]
		: params.userId
	const [analytics, setAnalytics] = useState<UserAnalytics | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function fetchUserAnalytics() {
			try {
				const response = await fetch(`/api/analytics/users/${userId}`)
				if (!response.ok) throw new Error('Failed to fetch analytics')
				const data = await response.json()
				setAnalytics(data)
			} catch (error) {
				console.error('Error fetching user analytics:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchUserAnalytics()
	}, [userId])

	if (loading) {
		return (
			<div className="container mx-auto p-6">
				<h1 className="text-2xl font-bold mb-8">User Analytics</h1>
				<div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
					<p>Loading analytics...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-2xl font-bold mb-8">User Analytics</h1>
			<div className="space-y-6">
				{/* Overview Card */}
				<div className="grid gap-4 md:grid-cols-3">
					<div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
						<h3 className="text-lg font-medium text-neutral-200">
							Total Page Views
						</h3>
						<p className="text-3xl font-bold mt-2">
							{analytics?.totalViews || 0}
						</p>
					</div>
					<div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
						<h3 className="text-lg font-medium text-neutral-200">
							Last Visit
						</h3>
						<p className="text-lg mt-2">
							{analytics?.lastVisit
								? new Date(
										analytics.lastVisit
									).toLocaleDateString()
								: 'Never'}
						</p>
					</div>
				</div>

				{/* Top Pages Table */}
				<div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden">
					<div className="p-6 border-b border-white/10">
						<h3 className="text-lg font-medium text-neutral-200">
							Most Visited Pages
						</h3>
					</div>
					<div className="p-6">
						<table className="w-full">
							<thead>
								<tr className="text-neutral-400 border-b border-white/10">
									<th className="text-left pb-3 font-medium">
										Page
									</th>
									<th className="text-right pb-3 font-medium">
										Views
									</th>
								</tr>
							</thead>
							<tbody>
								{analytics?.topPages?.map((page) => (
									<tr
										key={page.pathname}
										className="border-b border-white/5 last:border-0"
									>
										<td className="py-4 text-neutral-200">
											{page.pathname}
										</td>
										<td className="py-4 text-right text-neutral-400">
											{page.views.toLocaleString()}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	)
}
