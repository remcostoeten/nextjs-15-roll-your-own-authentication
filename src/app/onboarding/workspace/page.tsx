import { getSession } from '@/modules/authenticatie/helpers/session';
import { getUserWorkspaces } from '@/modules/workspaces/server/queries/get-user-workspaces';
import { WorkspaceOnboardingForm } from '@/modules/workspaces/ui/workspace-onboarding-form';
import { redirect } from 'next/navigation';

export default async function WorkspaceOnboardingPage({
	searchParams,
}: {
	searchParams: Promise<{ force?: string }>;
}) {
	const params = await searchParams;
	const session = await getSession();
	if (!session) {
		redirect('/login');
	}

	// Check if user already has workspaces (unless force parameter is used)
	const workspaces = await getUserWorkspaces();
	const forceAccess = params?.force === 'true';

	if (workspaces.length > 0 && !forceAccess) {
		redirect('/dashboard');
	}

	return (
		<div className="min-h-screen bg-[rgb(8,8,8)] flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-white mb-2">
						Create Your First Workspace
					</h1>
					<p className="text-white/60">
						Workspaces help you organize your projects and collaborate with your team.
					</p>
				</div>

				<WorkspaceOnboardingForm />
			</div>
		</div>
	);
}
