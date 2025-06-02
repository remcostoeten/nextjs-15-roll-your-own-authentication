import { getSession } from '@/modules/authenticatie/helpers/session';
import { getUserWorkspaces } from '@/modules/workspaces/server/queries/get-user-workspaces';
import { getWorkspaceMembers } from '@/modules/workspaces/server/queries/get-workspace-members';
import { MembersList } from '@/modules/workspaces/ui/members-list';
import { redirect } from 'next/navigation';

type TProps = {
	searchParams: Promise<{ workspace?: string }>;
};

/**
 * Server component that displays and manages members of the user's current workspace.
 *
 * Redirects unauthenticated users to the login page and users without workspaces to the onboarding flow. Selects the current workspace based on the `workspace` query parameter or defaults to the first available workspace. Renders a list of members for the selected workspace.
 *
 * @param searchParams - A promise resolving to an object that may contain a `workspace` query parameter to select the workspace.
 * @returns A React element displaying the workspace members and management interface.
 */
export default async function MembersPage({ searchParams }: TProps) {
	const resolvedSearchParams = await searchParams;
	const session = await getSession();
	if (!session) {
		redirect('/login');
	}

	const workspaces = await getUserWorkspaces();
	if (workspaces.length === 0) {
		redirect('/onboarding/workspace');
	}

	const workspaceId = resolvedSearchParams?.workspace;
	const currentWorkspace = workspaceId
		? workspaces.find((w) => w.id === workspaceId) || workspaces[0]
		: workspaces[0];
	const members = await getWorkspaceMembers(currentWorkspace.id);

	return (
		<div className="flex-1 p-6">
			<div className="max-w-6xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-white mb-2">Team Members</h1>
					<p className="text-white/60">
						Manage your workspace members and their permissions.
					</p>
				</div>

				<MembersList
					members={members}
					workspace={currentWorkspace}
					userRole={currentWorkspace.userRole || 'member'}
				/>
			</div>
		</div>
	);
}
