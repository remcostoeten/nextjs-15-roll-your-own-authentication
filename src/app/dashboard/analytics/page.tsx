import { getAnalytics } from '@/features/analytics/components/actions/analytics'
import { withAdminProtection } from '@/shared/components/admin-protection'
import { Suspense } from 'react'

type DailyView = {
	date: string
	views: number
}

type TopPage = {
	pathname: string
	views: number
}

type Analytics = {
	dailyViews: DailyView[]
	totalViews: number
	topPages: TopPage[]
}

// Main component that will be protected
function AnalyticsDashboard() {
	return (
		<div className="container mx-auto p-6">
			<h1 className="text-2xl font-bold mb-8">Analytics Dashboard</h1>

			<Suspense fallback={<div>Loading analytics...</div>}>
				<AnalyticsContent />
			</Suspense>
		</div>
	)
}

async function AnalyticsContent() {
	const { dailyViews, totalViews, topPages } =
		(await getAnalytics()) as Analytics

	return (
		<div className="space-y-8">
			{/* Total Views Card */}
			<div className="grid gap-4 md:grid-cols-3">
				<div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
					<h3 className="text-lg font-medium text-neutral-200">
						Total Page Views
					</h3>
					<p className="text-3xl font-bold mt-2">
						{totalViews.toLocaleString()}
					</p>
				</div>
			</div>

			{/* Top Pages Table */}
			<div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden">
				<div className="p-6 border-b border-white/10">
					<h3 className="text-lg font-medium text-neutral-200">
						Most Viewed Pages
					</h3>
				</div>
				<div className="p-6">
					<div className="overflow-x-auto">
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
								{topPages.map((page) => (
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

			{/* Daily Views Table */}
			<div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden">
				<div className="p-6 border-b border-white/10">
					<h3 className="text-lg font-medium text-neutral-200">
						Daily Views
					</h3>
				</div>
				<div className="p-6">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="text-neutral-400 border-b border-white/10">
									<th className="text-left pb-3 font-medium">
										Date
									</th>
									<th className="text-right pb-3 font-medium">
										Views
									</th>
								</tr>
							</thead>
							<tbody>
								{dailyViews.map((day) => (
									<tr
										key={day.date}
										className="border-b border-white/5 last:border-0"
									>
										<td className="py-4 text-neutral-200">
											{new Date(
												day.date
											).toLocaleDateString('en-US', {
												month: 'short',
												day: 'numeric',
												year: 'numeric'
											})}
										</td>
										<td className="py-4 text-right text-neutral-400">
											{day.views.toLocaleString()}
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

export default async function ProtectedAnalyticsDashboard() {
	return withAdminProtection(AnalyticsDashboard, {})
}
