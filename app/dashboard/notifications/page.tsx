import { getUserNotifications } from '@/modules/notifications/api/queries'
import { requireAuth } from '@/modules/authentication/utilities/auth'
import { NotificationList } from '@/modules/notifications/components/notification-list'
import type { Metadata } from 'next'
import { BellRing } from 'lucide-react'

export const metadata: Metadata = {
	title: 'Notifications',
	description: 'View your notifications',
}

export default async function NotificationsPage() {
	const user = await requireAuth()
	const { notifications } = await getUserNotifications(50, 0)

	return (
		<div className="container flex-1 px-4 py-8 sm:px-6 md:py-12">
			<div className="mx-auto max-w-3xl">
				<div className="mb-8 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
							<BellRing className="h-5 w-5 " />
						</div>
						<h1 className="text-2xl font-bold tracking-tight">
							Notifications
						</h1>
					</div>
					<div className="text-sm text-muted-foreground">
						{notifications.length} notification
						{notifications.length !== 1 ? 's' : ''}
					</div>
				</div>

				<div className="overflow-hidden rounded-xl border bg-card shadow-sm">
					<NotificationList notifications={notifications} />
				</div>
			</div>
		</div>
	)
}
