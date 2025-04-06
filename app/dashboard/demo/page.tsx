import AppSidebar from '@/components/dashboard/sidebar/app-sidebar'
import { BreadcrumbNav } from '@/components/dashboard/sidebar/breadcrumbs'
import {
	SidebarInset,
	SidebarProvider,
} from '@/components/dashboard/sidebar/sidebar'
import { requireAuth } from '@/modules/authentication/utilities/auth'

export default async function Page() {
	// Ensure user is authenticated
	await requireAuth()

	const breadcrumbItems = [
		{ title: 'Dashboard', href: '/dashboard', active: true },
	]

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className="bg-background">
				<BreadcrumbNav items={breadcrumbItems} />
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
					<div className="grid auto-rows-min gap-4 md:grid-cols-3">
						<div className="aspect-video rounded-xl bg-muted/50" />
						<div className="aspect-video rounded-xl bg-muted/50" />
						<div className="aspect-video rounded-xl bg-muted/50" />
					</div>
					<div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}
