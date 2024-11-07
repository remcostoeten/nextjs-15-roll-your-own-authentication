import { getUserAnalytics } from '@/features/analytics/components/actions/analytics'
import { withAdminProtection } from '@/shared/components/admin-protection'
import { Suspense } from 'react'

type UserAnalytics = {
	user: {
		id: string
		email: string
		role: string
		createdAt: string
	}
	sessions: {
		browser: string
		os: string
		device: string
		country: string
		city: string
		firstSeen: string
		lastSeen: string
	}[]
	pageViews: {
		pathname: string
		timestamp: string
		timeOnPage: number
		scrollDepth: number
		referrer: string
		exitPage: string
	}[]
	metadata: {
		totalSessions: number
		averageSessionDuration: number
		mostVisitedPages: { pathname: string; count: number }[]
		topReferrers: { referrer: string; count: number }[]
		devices: { device: string; count: number }[]
		browsers: { browser: string; count: number }[]
		countries: { country: string; count: number }[]
	}
}

function UserAnalyticsDashboard({ userId }: { userId: string }) {
	return (
		<div className="container mx-auto p-6">
			<Suspense fallback={<div>Loading user analytics...</div>}>
				<UserAnalyticsContent userId={userId} />
			</Suspense>
		</div>
	)
}

async function UserAnalyticsContent({ userId }: { userId: string }) {
	const analytics = await getUserAnalytics(userId)

	return (
		<div className="space-y-8">
			{/* User Info */}
			<div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
				<h2 className="text-xl font-semibold mb-4">User Information</h2>
				<div className="grid gap-4 md:grid-cols-2">
					<div>
						<p className="text-neutral-400">Email</p>
						<p className="text-lg">{analytics.user.email}</p>
					</div>
					<div>
						<p className="text-neutral-400">Role</p>
						<span
							className={`px-2 py-1 rounded text-xs ${
								analytics.user.role === 'admin'
									? 'bg-purple-500/20 text-purple-300'
									: 'bg-emerald-500/20 text-emerald-300'
							}`}
						>
							{analytics.user.role}
						</span>
					</div>
					<div>
						<p className="text-neutral-400">Member Since</p>
						<p>
							{new Date(
								analytics.user.createdAt
							).toLocaleDateString()}
						</p>
					</div>
				</div>
			</div>

			{/* Usage Stats */}
			<div className="grid gap-4 md:grid-cols-4">
				<StatCard
					label="Total Sessions"
					value={analytics.metadata.totalSessions}
				/>
				<StatCard
					label="Avg. Session Duration"
					value={`${Math.round(analytics.metadata.averageSessionDuration / 60)}m`}
				/>
				<StatCard
					label="Total Page Views"
					value={analytics.pageViews.length}
				/>
				<StatCard
					label="Countries Visited From"
					value={analytics.metadata.countries.length}
				/>
			</div>

			{/* Device & Browser Info */}
			<div className="grid gap-6 md:grid-cols-2">
				<div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
					<h3 className="text-lg font-medium mb-4">Devices</h3>
					<div className="space-y-2">
						{analytics.metadata.devices.map((device) => (
							<div
								key={device.device}
								className="flex justify-between items-center"
							>
								<span className="text-neutral-400">
									{device.device}
								</span>
								<span>{device.count}</span>
							</div>
						))}
					</div>
				</div>

				<div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
					<h3 className="text-lg font-medium mb-4">Browsers</h3>
					<div className="space-y-2">
						{analytics.metadata.browsers.map((browser) => (
							<div
								key={browser.browser}
								className="flex justify-between items-center"
							>
								<span className="text-neutral-400">
									{browser.browser}
								</span>
								<span>{browser.count}</span>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Session History */}
			<div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden">
				<div className="p-6 border-b border-white/10">
					<h3 className="text-lg font-medium">Session History</h3>
				</div>
				<div className="p-6">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="text-neutral-400 border-b border-white/10">
									<th className="text-left pb-3">Date</th>
									<th className="text-left pb-3">Browser</th>
									<th className="text-left pb-3">Device</th>
									<th className="text-left pb-3">Location</th>
								</tr>
							</thead>
							<tbody>
								{analytics.sessions.map((session, index) => (
									<tr
										key={index}
										className="border-b border-white/5 last:border-0"
									>
										<td className="py-4">
											{new Date(
												session.firstSeen
											).toLocaleString()}
										</td>
										<td className="py-4">
											{session.browser}
										</td>
										<td className="py-4">
											{session.device}
										</td>
										<td className="py-4">
											{session.city}, {session.country}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			{/* Page View History */}
			<div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden">
				<div className="p-6 border-b border-white/10">
					<h3 className="text-lg font-medium">Page Views</h3>
				</div>
				<div className="p-6">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="text-neutral-400 border-b border-white/10">
									<th className="text-left pb-3">Page</th>
									<th className="text-left pb-3">
										Time on Page
									</th>
									<th className="text-left pb-3">
										Scroll Depth
									</th>
									<th className="text-left pb-3">Referrer</th>
								</tr>
							</thead>
							<tbody>
								{analytics.pageViews.map((view, index) => (
									<tr
										key={index}
										className="border-b border-white/5 last:border-0"
									>
										<td className="py-4">
											{view.pathname}
										</td>
										<td className="py-4">
											{Math.round(view.timeOnPage / 1000)}
											s
										</td>
										<td className="py-4">
											{view.scrollDepth}%
										</td>
										<td className="py-4">
											{view.referrer || 'Direct'}
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

function StatCard({ label, value }: { label: string; value: string | number }) {
	return (
		<div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
			<p className="text-sm text-neutral-400">{label}</p>
			<p className="text-2xl font-semibold mt-1">{value}</p>
		</div>
	)
}

export default async function ProtectedUserAnalytics({
	params
}: {
	params: { userId: string }
}) {
	return withAdminProtection(UserAnalyticsDashboard, {
		userId: params.userId
	})
}
