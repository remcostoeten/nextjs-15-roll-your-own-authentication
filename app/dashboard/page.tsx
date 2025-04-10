import { Suspense } from 'react'
import { WelcomeBanner } from '@/modules/dashboard/components/welcome-banner'
import { SiteActivityFeed } from '@/modules/dashboard/components/site-activity-feed'
import { UserActivityFeed } from '@/modules/dashboard/components/user-activity-feed'
import { requireAuth } from '@/modules/authentication/utilities/auth'
import { getUserStats } from '@/modules/dashboard/api/queries'
import { getUserProfile } from '@/modules/profile/api/queries'

export const metadata = {
	title: 'Dashboard',
}

export default async function DashboardPage() {
	// Ensure user is authenticated
	const authUser = await requireAuth()

	// Get full user profile
	const userProfile = await getUserProfile()

	if (!userProfile) {
		throw new Error('Failed to load user profile')
	}

	// Get user stats
	const stats = await getUserStats(authUser.id)

	return (
		<>
			<div className="grid auto-rows-min gap-4 md:grid-cols-3">
				<div className="aspect-video rounded-xl bg-muted/50" />
				<div className="aspect-video rounded-xl bg-muted/50" />
				<div className="aspect-video rounded-xl bg-muted/50" />
			</div>

			<div className="flex flex-col gap-8 mt-4">
				<WelcomeBanner
					user={userProfile}
					stats={stats}
				/>

				<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
					<Suspense fallback={<div>Loading site activity...</div>}>
						<SiteActivityFeed />
					</Suspense>

					<Suspense fallback={<div>Loading your activity...</div>}>
						<UserActivityFeed userId={authUser.id} />
					</Suspense>
				</div>
			</div>
		</>
	)
}
