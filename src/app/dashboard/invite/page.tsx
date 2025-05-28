import { getSession } from '@/modules/authenticatie/helpers/session';
import { getUserWorkspaces } from '@/modules/workspaces/server/queries/get-user-workspaces';
import { InviteMemberForm } from '@/modules/workspaces/ui/invite-member-form';
import { redirect } from 'next/navigation';

interface InvitePageProps {
	searchParams?: { workspace?: string };
}

export default async function InvitePage({ searchParams }: InvitePageProps) {
	const session = await getSession();
	if (!session) {
		redirect('/login');
	}

	const workspaces = await getUserWorkspaces();
	if (workspaces.length === 0) {
		redirect('/onboarding/workspace');
	}

	// Find current workspace from search params or default to first
	const workspaceId = searchParams?.workspace;
	const currentWorkspace = workspaceId
		? workspaces.find(w => w.id === workspaceId) || workspaces[0]
		: workspaces[0];

	// Check if user has permission to invite (owner or admin)
	const canInvite = currentWorkspace.userRole && ['owner', 'admin'].includes(currentWorkspace.userRole);

	if (!canInvite) {
		redirect('/dashboard');
	}

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">Invite Team Members</h1>
				<p className="text-muted-foreground">
					Invite new members to join your workspace and collaborate on projects.
				</p>
			</div>

			<div className="max-w-2xl">
				<InviteMemberForm workspace={currentWorkspace} />
			</div>
		</div>
	);
}
