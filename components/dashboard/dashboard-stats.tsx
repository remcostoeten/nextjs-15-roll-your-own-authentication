'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Key, Shield, User, UserCheck } from 'lucide-react'

type User = {
	id: number
	email: string
	role: string
	emailVerified: boolean
	lastLoginAttempt: Date | null
	createdAt: Date
	securityScore?: number
	loginStreak?: number
	totalLogins?: number
	failedLoginAttempts?: number
	lastLocation?: {
		city?: string
		country?: string
	}
	lastDevice?: {
		browser?: string
		os?: string
	}
}

type DashboardStatsProps = {
	user: User
	sessionCount?: number
	recentActivity?: Array<{
		type: string
		timestamp: Date
		details: string
	}>
}

export default function DashboardStats({
	user,
	sessionCount = 0,
	recentActivity = []
}: DashboardStatsProps) {
	return (
		<div className="space-y-6">
			{/* Primary Stats */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Security Score
						</CardTitle>
						<Shield className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{user.securityScore || 0}%
						</div>
						<p className="text-xs text-muted-foreground">
							Based on account security settings
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Login Streak
						</CardTitle>
						<Activity className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{user.loginStreak || 0} days
						</div>
						<p className="text-xs text-muted-foreground">
							Consecutive daily logins
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Logins
						</CardTitle>
						<UserCheck className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{user.totalLogins || 0}
						</div>
						<p className="text-xs text-muted-foreground">
							Successful authentications
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Failed Attempts
						</CardTitle>
						<Key className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{user.failedLoginAttempts || 0}
						</div>
						<p className="text-xs text-muted-foreground">
							Unsuccessful login attempts
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Secondary Stats */}
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">
							Location & Device
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<p className="text-sm font-medium">
								Last Known Location
							</p>
							<p className="text-sm text-muted-foreground">
								{user.lastLocation?.city},{' '}
								{user.lastLocation?.country || 'Unknown'}
							</p>
						</div>
						<div>
							<p className="text-sm font-medium">
								Current Device
							</p>
							<p className="text-sm text-muted-foreground">
								{user.lastDevice?.browser} on{' '}
								{user.lastDevice?.os || 'Unknown'}
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-lg">
							Account Timeline
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<p className="text-sm font-medium">Member Since</p>
							<p className="text-sm text-muted-foreground">
								{new Date(user.createdAt).toLocaleDateString(
									'en-US',
									{
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									}
								)}
							</p>
						</div>
						<div>
							<p className="text-sm font-medium">Last Activity</p>
							<p className="text-sm text-muted-foreground">
								{user.lastLoginAttempt
									? new Date(
											user.lastLoginAttempt
										).toLocaleString()
									: 'Never'}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
