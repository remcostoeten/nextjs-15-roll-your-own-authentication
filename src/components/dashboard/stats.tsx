'use client'

import { Card, CardContent } from '@/components/ui/card'
import { formatDate } from 'helpers'
import { Activity, Globe, RefreshCcw, Shield } from 'lucide-react'

type DashboardStatsProps = {
	user: {
		email: string
		emailVerified: boolean
		lastLoginAttempt: string
		lastLocation: {
			country?: string
			city?: string
		} | null
	}
}

export function DashboardStats({ user }: DashboardStatsProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
			<Card>
				<CardContent className="pt-6">
					<div className="flex items-center gap-4">
						<div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
							<Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Account Status
							</p>
							<p className="text-xl font-semibold">Active</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent className="pt-6">
					<div className="flex items-center gap-4">
						<div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
							<Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Security Level
							</p>
							<p className="text-xl font-semibold">
								{user.emailVerified ? 'Enhanced' : 'Basic'}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent className="pt-6">
					<div className="flex items-center gap-4">
						<div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
							<RefreshCcw className="h-6 w-6 text-green-600 dark:text-green-400" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Last Activity
							</p>
							<p className="text-xl font-semibold">
								{formatDate(user.lastLoginAttempt, 'relative')}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent className="pt-6">
					<div className="flex items-center gap-4">
						<div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
							<Globe className="h-6 w-6 text-orange-600 dark:text-orange-400" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Location
							</p>
							<p className="text-xl font-semibold">
								{user.lastLocation?.city || 'Unknown'}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
