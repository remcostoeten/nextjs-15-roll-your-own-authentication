import type React from 'react'
import { cookies } from 'next/headers'
import { SidebarProvider } from '@/components/dashboard/sidebar/sidebar'
import { getCurrentUser } from '@/modules/authentication/utilities/auth'
import { getUserNotifications } from '@/modules/notifications/api/queries'
import { redirect } from 'next/navigation'
import { AppSidebar } from '@/components/dashboard/sidebar/app-sidebar'

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const user = await getCurrentUser()

	if (!user) {
		redirect('/login')
	}

	// Get unread notifications count using the existing function
	const { unreadCount } = await getUserNotifications(10, 0)

	// Get sidebar state from cookies
	const cookieStore = await cookies()
	const sidebarState = cookieStore.get('sidebar-state')
	const defaultState = sidebarState?.value as
		| 'expanded'
		| 'collapsed'
		| undefined

	return (
		<div className="flex h-screen overflow-hidden bg-background text-white">
			<AppSidebar />
			<div className="flex flex-1 flex-col overflow-hidden">
				{children}
			</div>
		</div>
	)
}
