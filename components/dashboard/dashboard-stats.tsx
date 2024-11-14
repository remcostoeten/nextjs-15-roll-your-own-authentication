'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserProfile } from '@/features/authentication/types'
import { Shield, User } from 'lucide-react'

type User = {
	id: number
	email: string
	role: 'user' | 'admin'
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
	user: UserProfile
	sessionCount?: number
	recentActivity?: Array<{
		type: string
		timestamp: Date
		details: string | null
	}>
}

export default function DashboardStats({
	user,
	sessionCount = 0,
	recentActivity = []
}: DashboardStatsProps) {
	return (
		<div className="space-y-6">
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Account Type
						</CardTitle>
						<User className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold capitalize">
							{user.role}
						</div>
						<p className="text-xs text-muted-foreground">
							Account permissions level
						</p>
					</CardContent>
				</Card>
				
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
			</div>
		</div>
	)
}
