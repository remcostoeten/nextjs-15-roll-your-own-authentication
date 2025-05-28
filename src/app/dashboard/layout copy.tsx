import { DashboardHeader } from '@/components/dashboard-header';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { getSession } from '@/modules/authenticatie/helpers/session';
import { WorkspaceProvider } from '@/modules/workspaces/hooks/use-workspace';
import { getUserWorkspaces } from '@/modules/workspaces/server/queries/get-user-workspaces';
import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar';
import { redirect } from 'next/navigation';

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

	// Find current workspace from search params or default to first (if any workspaces exist)
	const workspaceId = searchParams?.workspace;
	const currentWorkspace = workspaces.length > 0
		? (workspaceId ? workspaces.find(w => w.id === workspaceId) || workspaces[0] : workspaces[0])
		: null;

	return (
		<WorkspaceProvider
			initialWorkspace={currentWorkspace}
			initialWorkspaces={workspaces}
		>
			<SidebarProvider>
				<AppSidebar
					className="sidebar"

				/>
				<SidebarInset>
					<DashboardHeader />
					<main className="flex-1 overflow-auto">
						<div className="container mx-auto p-6 space-y-6">
							{children}
						</div>
					</main>
				</SidebarInset>
			</SidebarProvider>
		</WorkspaceProvider>
	);
}
