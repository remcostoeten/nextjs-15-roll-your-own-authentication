import {
	getRecentActivity,
	getSessionCount,
	getUserData
} from '@/app/server/queries'
import DashboardStats from '@/components/dashboard/dashboard-stats'
import { CollapsibleSection } from '@/components/ui/collapsible-section'
import { formatDate } from 'helpers'
import {
	Activity,
	AlertCircle,
	Calendar,
	Globe,
	Key,
	Lock,
	Mail,
	RefreshCcw,
	Shield,
	Smartphone,
	UserCircle
} from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
	const user = await getUserData()

	if (!user) {
		redirect('/login?callbackUrl=/dashboard')
	}

	const [sessionCount, recentActivity] = await Promise.all([
		getSessionCount(user.id),
		getRecentActivity(user.id)
	])

	const formattedActivity = recentActivity.map((activity) => ({
		type: activity.type,
		timestamp: activity.createdAt,
		details: activity.details?.message || activity.status
	}))

	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-background/80">
			<header className="sticky top-0 z-40 backdrop-blur-xl border-b bg-background/60">
				<div className="container py-4">
					<h1 className="text-4xl font-bold tracking-tight">
						Welcome back, {user.email?.split('@')[0]}!
					</h1>
					<p className="text-muted-foreground mt-1">
						Here's what's happening with your account
					</p>
				</div>
			</header>

			<main className="container py-8 space-y-8">
				<DashboardStats
					user={user}
					sessionCount={sessionCount}
					recentActivity={formattedActivity}
				/>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div className="group hover:shadow-lg transition-all duration-200 rounded-xl border bg-card p-6 backdrop-blur-sm">
						<div className="flex items-center gap-4">
							<div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
								<Activity className="h-6 w-6 text-blue-500" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">
									Account Status
								</p>
								<p className="text-xl font-semibold">Active</p>
							</div>
						</div>
					</div>

					<div className="group hover:shadow-lg transition-all duration-200 rounded-xl border bg-card p-6 backdrop-blur-sm">
						<div className="flex items-center gap-4">
							<div className="p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
								<Shield className="h-6 w-6 text-purple-500" />
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
					</div>

					<div className="group hover:shadow-lg transition-all duration-200 rounded-xl border bg-card p-6 backdrop-blur-sm">
						<div className="flex items-center gap-4">
							<div className="p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
								<RefreshCcw className="h-6 w-6 text-green-500" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">
									Last Activity
								</p>
								<p className="text-xl font-semibold">
									{formatDate(
										user.lastLoginAttempt,
										'relative'
									)}
								</p>
							</div>
						</div>
					</div>

					<div className="group hover:shadow-lg transition-all duration-200 rounded-xl border bg-card p-6 backdrop-blur-sm">
						<div className="flex items-center gap-4">
							<div className="p-3 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
								<Key className="h-6 w-6 text-amber-500" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">
									2FA Status
								</p>
								<p className="text-xl font-semibold">
									Disabled
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2 space-y-8">
						{/* Profile Details Section */}
						<CollapsibleSection
							id="profile-details"
							title="Profile Details"
							icon={<UserCircle className="h-6 w-6" />}
						>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-6">
									<div className="flex items-center gap-4">
										<div className="p-2 bg-background rounded-lg border">
											<Mail className="h-5 w-5 text-muted-foreground" />
										</div>
										<div>
											<p className="text-sm text-muted-foreground">
												Email
											</p>
											<p className="font-medium">
												{user.email}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-4">
										<div className="p-2 bg-background rounded-lg border">
											<Calendar className="h-5 w-5 text-muted-foreground" />
										</div>
										<div>
											<p className="text-sm text-muted-foreground">
												Member Since
											</p>
											<p className="font-medium">
												{formatDate(
													user.createdAt,
													'long'
												)}
											</p>
										</div>
									</div>
								</div>
								<div className="space-y-6">
									<div className="flex items-center gap-4">
										<div className="p-2 bg-background rounded-lg border">
											<Globe className="h-5 w-5 text-muted-foreground" />
										</div>
										<div>
											<p className="text-sm text-muted-foreground">
												Last Location
											</p>
											<p className="font-medium">
												{user.lastLocation?.city ||
													'Unknown'}
												,{' '}
												{user.lastLocation?.country ||
													'Unknown'}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-4">
										<div className="p-2 bg-background rounded-lg border">
											<Smartphone className="h-5 w-5 text-muted-foreground" />
										</div>
										<div>
											<p className="text-sm text-muted-foreground">
												Last Device
											</p>
											<p className="font-medium">
												{user.lastDevice
													? `${user.lastDevice.browser} on ${user.lastDevice.os}`
													: 'Unknown Device'}
											</p>
										</div>
									</div>
								</div>
							</div>
						</CollapsibleSection>

						{/* Security Overview Section */}
						<CollapsibleSection
							id="security-overview"
							title="Security Overview"
							icon={<Lock className="h-6 w-6" />}
						>
							<div className="space-y-4">
								<div className="flex items-center justify-between p-4 bg-background/50 rounded-xl border backdrop-blur-sm">
									<div className="flex items-center gap-4">
										<div className="p-2 bg-background rounded-lg border">
											<AlertCircle className="h-5 w-5 text-muted-foreground" />
										</div>
										<div>
											<p className="font-medium">
												Email Verification
											</p>
											<p className="text-sm text-muted-foreground">
												Verify your email to enhance
												account security
											</p>
										</div>
									</div>
									<span
										className={`px-3 py-1 rounded-full text-xs font-medium ${
											user.emailVerified
												? 'bg-green-500/10 text-green-500'
												: 'bg-yellow-500/10 text-yellow-500'
										}`}
									>
										{user.emailVerified
											? 'VERIFIED'
											: 'PENDING'}
									</span>
								</div>

								<div className="flex items-center justify-between p-4 bg-background/50 rounded-xl border backdrop-blur-sm">
									<div className="flex items-center gap-4">
										<div className="p-2 bg-background rounded-lg border">
											<Key className="h-5 w-5 text-muted-foreground" />
										</div>
										<div>
											<p className="font-medium">
												Two-Factor Authentication
											</p>
											<p className="text-sm text-muted-foreground">
												Add an extra layer of security
												to your account
											</p>
										</div>
									</div>
									<span className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-500/10 text-neutral-500">
										DISABLED
									</span>
								</div>
							</div>
						</CollapsibleSection>
					</div>

					{/* Recent Activity Section */}
					<CollapsibleSection
						id="recent-activity"
						title="Recent Activity"
						icon={<Activity className="h-6 w-6" />}
					>
					<div className="space-y-4">
    {(user.recentActivity && user.recentActivity.length > 0) ? (
        user.recentActivity.map((activity: any, index: number) => (
            <div
                key={index}
                className="group flex items-start gap-4 p-4 bg-background/50 rounded-xl border backdrop-blur-sm hover:shadow-md transition-all"
            >
                <div className="p-2 bg-background rounded-lg border">
                    <Activity className="h-4 w-4" />
                </div>
            </div>
        ))
    ) : (
        <p>No recent activity</p>
    )}
</div>
					</CollapsibleSection>
				</div>
			</main>
		</div>
	)
}
