'use client'

import { SecurityOverviewStats } from '@/features/dashboard/types'

type SecurityOverviewProps = {
	stats: SecurityOverviewStats
	user: any
	className?: string
}

export default function SecurityOverview({
	stats,
	user,
	className
}: SecurityOverviewProps) {
	return (
		<div
			className={`rounded-lg border bg-card p-6 min-h-[500px] ${className}`}
		>
			<h2 className="text-2xl font-semibold mb-4">Security Overview</h2>
			<div className="grid gap-4 md:grid-cols-2">
				<div className="space-y-4">
					<div className="min-h-[80px]">
						<p className="text-sm text-muted-foreground">
							Total Logins
						</p>
						<p className="text-2xl font-medium">
							{stats?.totalLogins ?? '—'}
						</p>
					</div>
					<div className="min-h-[80px]">
						<p className="text-sm text-muted-foreground">
							Failed Attempts
						</p>
						<p className="text-2xl font-medium">
							{stats?.failedAttempts ?? '—'}
						</p>
					</div>
					<div className="min-h-[80px]">
						<p className="text-sm text-muted-foreground">
							Last Login Location
						</p>
						<p className="text-2xl font-medium">
							{stats?.lastLoginLocation || '—'}
						</p>
					</div>
					<div className="min-h-[80px]">
						<p className="text-sm text-muted-foreground">
							Last Login Device
						</p>
						<p className="text-2xl font-medium">
							{stats?.lastLoginDevice || '—'}
						</p>
					</div>
				</div>
				<div className="space-y-4">
					<div className="min-h-[80px]">
						<p className="text-sm text-muted-foreground">
							Security Score
						</p>
						<p className="text-2xl font-medium">
							{stats?.securityScore
								? `${stats.securityScore}%`
								: '—'}
						</p>
					</div>
					<div className="min-h-[80px]">
						<p className="text-sm text-muted-foreground">
							Active Devices
						</p>
						<p className="text-2xl font-medium">
							{stats?.activeDevices ?? '—'}
						</p>
					</div>
					<div className="min-h-[80px]">
						<p className="text-sm text-muted-foreground">
							Password Last Changed
						</p>
						<p className="text-2xl font-medium">
							{stats?.passwordLastChanged
								? new Date(
										stats.passwordLastChanged
									).toLocaleDateString()
								: 'Never'}
						</p>
					</div>
				</div>
			</div>

			<div className="mt-6 min-h-[200px]">
				<h3 className="text-lg font-semibold mb-3">
					Connected Devices
				</h3>
				<div className="space-y-3">
					{stats?.devices?.length > 0 ? (
						stats.devices.map((device) => (
							<div
								key={device.id}
								className="flex items-center justify-between p-3 bg-muted rounded-lg min-h-[72px]"
							>
								<div className="flex items-center gap-3">
									<div>
										<p className="font-medium">
											{device.browser} on {device.os}
										</p>
										<p className="text-sm text-muted-foreground">
											{device.location ||
												'Unknown location'}{' '}
											• Last active:{' '}
											{new Date(
												device.lastActive
											).toLocaleDateString()}
										</p>
									</div>
								</div>
								{device.isCurrent && (
									<span className="text-sm text-green-500">
										Current device
									</span>
								)}
							</div>
						))
					) : (
						<div className="text-center text-muted-foreground py-8">
							No devices connected
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
