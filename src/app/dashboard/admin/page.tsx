import {
	getAdminStats,
	getSystemHealth
} from '@/features/admin/components/actions/admin'
import { withAdminProtection } from '@/shared/components/admin-protection'
import { Suspense } from 'react'

// Add missing components
function StatCard({ label, value }: { label: string; value: string | number }) {
	return (
		<div className="p-4 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
			<p className="text-sm text-neutral-400">{label}</p>
			<p className="text-2xl font-semibold mt-1">{value}</p>
		</div>
	)
}

function HealthIndicator({
	label,
	status
}: {
	label: string
	status: 'healthy' | 'degraded' | 'down'
}) {
	const getStatusColor = () => {
		switch (status) {
			case 'healthy':
				return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
			case 'degraded':
				return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
			case 'down':
				return 'bg-red-500/20 text-red-300 border-red-500/30'
		}
	}

	return (
		<div className="flex items-center justify-between">
			<span className="text-neutral-400">{label}</span>
			<span
				className={`px-2 py-1 rounded text-xs border ${getStatusColor()}`}
			>
				{status.charAt(0).toUpperCase() + status.slice(1)}
			</span>
		</div>
	)
}

/**
 * Admin Dashboard Component
 * Displays admin statistics and system health information
 */
function AdminDashboard() {
	return (
		<div className="container mx-auto p-6">
			<h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>

			<div className="grid gap-6 md:grid-cols-2">
				<Suspense fallback={<div>Loading stats...</div>}>
					<AdminStats />
				</Suspense>

				<Suspense fallback={<div>Loading system health...</div>}>
					<SystemHealthPanel />
				</Suspense>
			</div>
		</div>
	)
}

async function AdminStats() {
	const stats = await getAdminStats()

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-semibold">Statistics</h2>
			<div className="grid gap-4 grid-cols-2">
				<StatCard label="Total Users" value={stats.totalUsers} />
				<StatCard label="Active Users" value={stats.activeUsers} />
				<StatCard label="New Today" value={stats.newUsersToday} />
				<StatCard label="Page Views" value={stats.totalPageViews} />
			</div>
		</div>
	)
}

async function SystemHealthPanel() {
	const health = await getSystemHealth()

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-semibold">System Health</h2>
			<div className="space-y-2">
				<HealthIndicator
					label="Database"
					status={health.databaseStatus}
				/>
				<HealthIndicator label="API" status={health.apiStatus} />
				<div className="text-sm">
					<span className="text-neutral-400">Last Backup: </span>
					<span>{new Date(health.lastBackup).toLocaleString()}</span>
				</div>
				<div className="text-sm">
					<span className="text-neutral-400">
						Active Connections:{' '}
					</span>
					<span>{health.activeConnections}</span>
				</div>
				<div className="text-sm">
					<span className="text-neutral-400">Server Load: </span>
					<span>{health.serverLoad}%</span>
				</div>
			</div>
		</div>
	)
}

// Export protected version
export default async function ProtectedAdminDashboard() {
	return withAdminProtection(AdminDashboard, {})
}
