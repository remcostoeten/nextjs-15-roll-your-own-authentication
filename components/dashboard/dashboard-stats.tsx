'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type User = {
	id: number
	email: string
	role: string
	emailVerified: boolean
	lastLoginAttempt: Date | null
	createdAt: Date
}

type DashboardStatsProps = {
	user: User
	sessionCount?: number
}

export default function DashboardStats({
	user,
	sessionCount = 0
}: DashboardStatsProps) {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Total Sessions
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{sessionCount}</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Account Type
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold capitalize">
						{user?.role || 'User'}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Email</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-md font-medium truncate">
						{user?.email}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Member Since
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{new Date(
							user?.createdAt || Date.now()
						).toLocaleDateString()}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
