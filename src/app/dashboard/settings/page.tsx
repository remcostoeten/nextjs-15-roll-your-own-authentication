import { getSession } from '@/modules/authenticatie/helpers/session';
import { DevTools } from '@/modules/authenticatie/ui/dev-tools';
import { getUserWorkspaces } from '@/modules/workspaces/server/queries/get-user-workspaces';
import { getWorkspaceMembers } from '@/modules/workspaces/server/queries/get-workspace-members';
import { WorkspaceSettingsEnhanced } from '@/modules/workspaces/ui/workspace-settings-enhanced';
import { redirect } from 'next/navigation';

interface WorkspaceSettingsPageProps {
	searchParams: Promise<{ workspace?: string }>;
}

/**
 * Renders the workspace settings page for an authenticated user.
 *
 * Redirects to the login page if the user is not authenticated, to the onboarding page if the user has no workspaces, and to the dashboard if the user lacks admin permissions in the selected workspace. Displays the workspace settings interface for the current workspace, including member management and preferences.
 *
 * @param searchParams - A promise resolving to search parameters, optionally containing a workspace ID.
 * @returns The workspace settings page as a React component.
 */
export default async function WorkspaceSettingsPage({ searchParams }: WorkspaceSettingsPageProps) {
	const params = await searchParams;
	const session = await getSession();
	if (!session) {
		redirect('/login');
	}

	const workspaces = await getUserWorkspaces();
	if (workspaces.length === 0) {
		redirect('/onboarding/workspace');
	}

	// Find current workspace from search params or default to first
	const workspaceId = params?.workspace;
	const currentWorkspace = workspaceId
		? workspaces.find((w) => w.id === workspaceId) || workspaces[0]
		: workspaces[0];

	// Check if user has admin permissions
	if (!currentWorkspace.userRole || !['owner', 'admin'].includes(currentWorkspace.userRole)) {
		redirect('/dashboard');
	}

	// Get workspace members
	const members = await getWorkspaceMembers(currentWorkspace.id);

	return (
		<div className="flex-1 p-6">
			<div className="max-w-4xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-white mb-2">Workspace Settings</h1>
					<p className="text-white/60">
						Manage your workspace settings, members, and preferences.
					</p>
				</div>

				<WorkspaceSettingsEnhanced
					workspace={currentWorkspace}
					members={members}
					userRole={currentWorkspace.userRole}
				/>
			</div>
			<DevTools />
		</div>
	);
}
