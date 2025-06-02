import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { getSession } from '@/modules/authenticatie/helpers/session';
import { NotificationsDropdown } from '@/modules/notifications/components/notifications-dropdown';
import { WorkspaceProvider } from '@/modules/workspaces/hooks/use-workspace';
import { getUserWorkspaces } from '@/modules/workspaces/server/queries/get-user-workspaces';
import { redirect } from 'next/navigation';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
	Separator,
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from 'ui';
import { UserProviderWrapper } from './user-provider-wrapper';

/**
 * Provides the main layout for dashboard pages, handling user authentication, workspace selection, and context providers.
 *
 * Redirects unauthenticated users to the login page and users without workspaces to the workspace onboarding page, unless bypassed via query parameters. Wraps the dashboard content with workspace, sidebar, and user context providers, and renders the sidebar, header with breadcrumbs and notifications, and the main content area.
 *
 * @param children - The content to display within the dashboard layout.
 * @param searchParams - Optional query parameters for selecting a workspace or bypassing workspace checks.
 *
 * @returns The dashboard layout JSX structure.
 */
export default async function DashboardLayout({
	children,
	searchParams,
}: {
	children: React.ReactNode;
	searchParams?: { workspace?: string; bypass?: string };
}) {
	const session = await getSession();
	if (!session) {
		redirect('/login');
	}

	const workspaces = await getUserWorkspaces();

	const bypassWorkspaceCheck = searchParams?.bypass === 'true';
	if (workspaces.length === 0 && !bypassWorkspaceCheck) {
		redirect('/onboarding/workspace');
	}

	const workspaceId = searchParams?.workspace;
	const currentWorkspace =
		workspaces.length > 0
			? workspaceId
				? workspaces.find((w) => w.id === workspaceId) || workspaces[0]
				: workspaces[0]
			: null;

	return (
		<WorkspaceProvider initialWorkspace={currentWorkspace} initialWorkspaces={workspaces}>
			<SidebarProvider>
				<UserProviderWrapper>
					<AppSidebar />
					<SidebarInset>
						<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
							<div className="flex items-center gap-2 px-4">
								<SidebarTrigger className="-ml-1" />
								<Separator orientation="vertical" className="mr-2 h-4" />
								<Breadcrumb>
									<BreadcrumbList>
										<BreadcrumbItem>
											<BreadcrumbLink href="/dashboard">
												Dashboard
											</BreadcrumbLink>
										</BreadcrumbItem>
										<BreadcrumbSeparator />
										<BreadcrumbItem>
											<BreadcrumbPage>Overview</BreadcrumbPage>
										</BreadcrumbItem>
									</BreadcrumbList>
								</Breadcrumb>
							</div>
							<div className="ml-auto px-4">
								<NotificationsDropdown />
							</div>
						</header>
						<div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
					</SidebarInset>
				</UserProviderWrapper>
			</SidebarProvider>
		</WorkspaceProvider>
	);
}
