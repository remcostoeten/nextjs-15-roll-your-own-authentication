import { getUserNotifications } from '@/modules/notifications/api/queries'
import { requireAdmin } from '@/modules/authentication/lib/auth'
import { NotificationList } from '@/modules/notifications/components/notification-list'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Manage Notifications',
	description: 'Create and manage notifications',
}

export default async function AdminNotificationsPage() {
	await requireAdmin()
	const { notifications, total } = await getUserNotifications(50, 0)

	return (
		<div className="flex-1 space-y-4 p-8 pt-6">
			<div className="flex items-center justify-between">
				<h2 className="text-3xl font-bold tracking-tight">
					Notifications
				</h2>
				<Button asChild>
					<Link href="/dashboard/admin/notifications/create">
						<Plus className="mr-2 h-4 w-4" />
						Create Notification
					</Link>
				</Button>
			</div>

			<div className="rounded-md border">
				<NotificationList
					notifications={notifications}
					className="rounded-md"
				/>
			</div>
		</div>
	)
}
