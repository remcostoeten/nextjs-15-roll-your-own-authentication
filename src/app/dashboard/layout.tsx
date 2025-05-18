'use client';

import { AppSidebar } from '@/components/navigation/app-sidebar';
import { useAuth } from '@/modules/authenticatie/hooks/use-auth';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb';
import { Separator } from '@/shared/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/shared/components/ui/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const auth = useAuth();

	if (auth.status === 'loading') {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900" />
			</div>
		);
	}

	if (auth.status === 'unauthenticated') {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">Not authenticated</h1>
					<p className="text-gray-600">Please log in to access the dashboard.</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<BreadcrumbPage>Overview</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
			</SidebarInset>
		</>
	);
}
