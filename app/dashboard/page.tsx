import { getUserData } from '@/app/server/queries'
import { CollapsibleSection } from '@/components/ui/collapsible-section'
import { formatDate } from 'helpers'
import {
	Activity,
	AlertCircle,
	Calendar,
	Globe,
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

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800">
			<header className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-neutral-700">
				<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						Welcome back, {user.email.split('@')[0]}!
					</h1>
					<p className="mt-2 text-gray-600 dark:text-gray-400">
						Here's what's happening with your account
					</p>
				</div>
			</header>

			<main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
						<div className="flex items-center gap-4">
							<div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
								<Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
							</div>
							<div>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Account Status
								</p>
								<p className="text-xl font-semibold text-gray-900 dark:text-white">
									Active
								</p>
							</div>
						</div>
					</div>
					<div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
						<div className="flex items-center gap-4">
							<div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
								<Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
							</div>
							<div>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Security Level
								</p>
								<p className="text-xl font-semibold text-gray-900 dark:text-white">
									{user.emailVerified ? 'Enhanced' : 'Basic'}
								</p>
							</div>
						</div>
					</div>
					<div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
						<div className="flex items-center gap-4">
							<div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
								<RefreshCcw className="h-6 w-6 text-green-600 dark:text-green-400" />
							</div>
							<div>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Last Activity
								</p>
								<p className="text-xl font-semibold text-gray-900 dark:text-white">
									{formatDate(
										user.lastLoginAttempt,
										'relative'
									)}
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
								<div className="space-y-4">
									<div className="flex items-center gap-3">
										<Mail className="h-5 w-5 text-gray-400" />
										<div>
											<p className="text-sm text-gray-500 dark:text-gray-400">
												Email
											</p>
											<p className="font-medium text-gray-900 dark:text-white">
												{user.email}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<Calendar className="h-5 w-5 text-gray-400" />
										<div>
											<p className="text-sm text-gray-500 dark:text-gray-400">
												Member Since
											</p>
											<p className="font-medium text-gray-900 dark:text-white">
												{formatDate(
													user.createdAt,
													'long'
												)}
											</p>
										</div>
									</div>
								</div>
								<div className="space-y-4">
									<div className="flex items-center gap-3">
										<Globe className="h-5 w-5 text-gray-400" />
										<div>
											<p className="text-sm text-gray-500 dark:text-gray-400">
												Last Location
											</p>
											<p className="font-medium text-gray-900 dark:text-white">
												{user.lastLocation?.city ||
													'Unknown'}
												,{' '}
												{user.lastLocation?.country ||
													'Unknown'}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<Smartphone className="h-5 w-5 text-gray-400" />
										<div>
											<p className="text-sm text-gray-500 dark:text-gray-400">
												Last Device
											</p>
											<p className="font-medium text-gray-900 dark:text-white">
												{user.lastDevice
													? `${user.lastDevice.browser || 'Unknown browser'} on ${user.lastDevice.os || 'Unknown OS'}${
															user.lastDevice
																.isMobile
																? ' (Mobile)'
																: ''
														}`
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
								<div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-900 rounded-lg">
									<div className="flex items-center gap-3">
										<AlertCircle className="h-5 w-5 text-gray-400" />
										<div>
											<p className="font-medium text-gray-900 dark:text-white">
												Email Verification
											</p>
											<p className="text-sm text-gray-500 dark:text-gray-400">
												Verify your email to enhance
												account security
											</p>
										</div>
									</div>
									<span
										className={`px-3 py-1 rounded-full text-xs font-medium ${
											user.emailVerified
												? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
												: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
										}`}
									>
										{user.emailVerified
											? 'VERIFIED'
											: 'PENDING'}
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
							{user.recentActivity?.map((activity, index) => (
								<div
									key={index}
									className="flex items-start gap-3"
								>
									<div className="p-2 bg-gray-100 dark:bg-neutral-900 rounded">
										<Activity className="h-4 w-4 text-gray-500" />
									</div>
									<div>
										<p className="font-medium text-gray-900 dark:text-white">
											{activity.type}
										</p>
										<p className="text-sm text-gray-500">
											{formatDate(
												activity.timestamp,
												'relative'
											)}
										</p>
										<p className="text-sm text-gray-500">
											{activity.details?.message || ''}
										</p>
									</div>
								</div>
							)) || (
								<p className="text-gray-500 dark:text-gray-400 text-center py-4">
									No recent activity to display
								</p>
							)}
						</div>
					</CollapsibleSection>
				</div>
			</main>
		</div>
	)
}
