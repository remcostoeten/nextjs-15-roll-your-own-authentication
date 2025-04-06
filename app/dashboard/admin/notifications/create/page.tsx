import { getUsersForNotificationTargeting } from '@/modules/notifications/api/queries'
import { requireAdmin } from '@/modules/authentication/utilities/auth'
import { CreateNotificationForm } from '@/modules/notifications/components/create-notification-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Create Notification',
	description: 'Create a new notification',
}

export default async function CreateNotificationPage() {
	await requireAdmin()
	const users = await getUsersForNotificationTargeting()

	return (
		<div className="flex-1 space-y-4 p-8 pt-6">
			<div className="flex items-center justify-between">
				<h2 className="text-3xl font-bold tracking-tight">
					Create Notification
				</h2>
			</div>

			<div className="rounded-md border p-6">
				<CreateNotificationForm users={users} />
			</div>
		</div>
	)
}
