import { getUserData } from '@/app/server/queries'
import { ActivityFeed } from '@/components/dashboard/activity'
import { DashboardHeader } from '@/components/dashboard/header'
import { SecurityOverview } from '@/components/dashboard/security'
import { DashboardStats } from '@/components/dashboard/stats'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
	const user = await getUserData()

	if (!user) {
		redirect('/login?callbackUrl=/dashboard')
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-background/80">
			<DashboardHeader user={user} />

			<main className="container mx-auto py-8 px-4">
				<DashboardStats user={user} />

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
					<div className="lg:col-span-2">
						<SecurityOverview user={user} />
					</div>
					<div>
						<ActivityFeed activities={user.recentActivity} />
					</div>
				</div>
			</main>
		</div>
	)
}
