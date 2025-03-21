'use client'

import { useEffect } from 'react'
import { useAuth } from '@/modules/authentication/hooks/use-auth'
import { useUserMetrics } from '@/modules/user-metrics/hooks'
import { useRouter } from 'next/navigation'
import { MapPinIcon, ClockIcon, ComputerIcon, GithubIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from 'ui'
import { Skeleton } from 'ui'
import type { User } from '@/modules/authentication/state/use-auth-state'

export default function DashboardView() {
	const { user, isLoading, logout } = useAuth()
	const metrics = useUserMetrics()
	const router = useRouter()

	useEffect(() => {
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
		return <LoadingState />
	}

	if (!user) {
		return <LoadingState />
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto py-8 px-4">
				<header className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold">Dashboard</h1>
					<button
						onClick={handleLogout}
						className="text-muted-foreground hover:text-foreground transition-colors"
					>
						Sign out →
					</button>
				</header>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					<Card>
						<CardHeader>
							<CardTitle>Profile Information</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex items-center space-x-4">
									<div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center">
										<span className="text-primary text-lg font-semibold">
											{user?.firstName?.[0] ||
												user?.email?.[0]?.toUpperCase() ||
												'?'}
										</span>
									</div>
									<div>
										<h3 className="font-medium">
											{user?.firstName && user?.lastName
												? `${user.firstName} ${user.lastName}`
												: user?.email?.split('@')[0] || 'User'}
										</h3>
										<p className="text-sm text-muted-foreground">
											{user?.email}
										</p>
									</div>
								</div>

								<div className="grid gap-4">
									<div className="flex justify-between">
										<span className="text-sm text-muted-foreground">User ID</span>
										<span className="text-sm font-mono">{user?.id}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-muted-foreground">Role</span>
										<span className="text-sm">{user?.role}</span>
									</div>
									{user?.githubId && (
										<div className="flex justify-between items-center">
											<span className="text-sm text-muted-foreground">GitHub</span>
											<div className="flex items-center space-x-2">
												<GithubIcon className="h-4 w-4" />
												<span className="text-sm">{user.githubId}</span>
											</div>
										</div>
									)}
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Current Session</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex items-center space-x-3">
									<MapPinIcon className="h-5 w-5 text-muted-foreground" />
									<div>
										<p className="text-sm text-muted-foreground">
											Location
										</p>
										<p className="text-sm">
											{metrics.currentLocation?.city}, {metrics.currentLocation?.country}
										</p>
									</div>
								</div>
								<div className="flex items-center space-x-3">
									<ClockIcon className="h-5 w-5 text-muted-foreground" />
									<div>
										<p className="text-sm text-muted-foreground">
											Timezone
										</p>
										<p className="text-sm">
											{metrics.currentLocation?.timezone}
										</p>
									</div>
								</div>
								<div className="flex items-center space-x-3">
									<ComputerIcon className="h-5 w-5 text-muted-foreground" />
									<div>
										<p className="text-sm text-muted-foreground">
											Device
										</p>
										<p className="text-sm">
											{metrics.device?.os} - {metrics.device?.browser}
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Account Stats</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div>
									<p className="text-sm text-muted-foreground mb-1">
										Login Streak
									</p>
									<div className="flex items-center justify-between">
										<span className="text-sm">
											{metrics.loginStreak} days
										</span>
										<div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
											<div
												className="h-full bg-primary rounded-full"
												style={{
													width: `${Math.min((metrics.loginStreak / 30) * 100, 100)}%`,
												}}
											/>
										</div>
									</div>
								</div>
								<div>
									<p className="text-sm text-muted-foreground mb-1">
										Account Age
									</p>
									<p className="text-sm">
										{metrics.accountAge}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground mb-1">
										Last Login
									</p>
									<p className="text-sm">
										{metrics.lastLoginFormatted}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}

function LoadingState() {
	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto py-8 px-4">
				<div className="space-y-8">
					<Skeleton className="h-8 w-48" />
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						<Skeleton className="h-[300px] rounded-lg" />
						<Skeleton className="h-[300px] rounded-lg" />
						<Skeleton className="h-[300px] rounded-lg" />
					</div>
				</div>
			</div>
		</div>
	)
}
