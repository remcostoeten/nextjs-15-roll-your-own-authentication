import { getUserNotifications } from "@/modules/notifications/api/queries"
import { requireAuth } from "@/modules/authentication/lib/auth"
import { NotificationList } from "@/modules/notifications/components/notification-list"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Notifications",
  description: "View your notifications",
}

export default async function NotificationsPage() {
  const user = await requireAuth()
  const { notifications } = await getUserNotifications(50, 0)

  return (
    <div className="container flex-1 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        <NotificationList notifications={notifications} className="border rounded-md" />
      </div>
    </div>
  )
}

