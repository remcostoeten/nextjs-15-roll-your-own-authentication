import { redirect } from 'next/navigation';
import { getSession } from '@/modules/authenticatie/helpers/session';
import { getUserWorkspaces } from '@/modules/workspaces/server/queries/get-user-workspaces';
import { getWorkspaceProjects } from '@/modules/projects/server/queries/get-workspace-projects';
import { ProjectsList } from '@/modules/projects/ui/projects-list';

type PageProps = {
	searchParams: Promise<{ workspace?: string }>;
};

/**
 * Renders the projects management page for the current user's workspace.
 *
 * Redirects to the login page if the user is not authenticated, or to workspace onboarding if the user has no workspaces. Displays a list of projects for the selected or default workspace.
 *
 * @param searchParams - A promise resolving to search parameters, optionally containing a workspace ID.
 * @returns The projects page as a React element.
 */
export default async function ProjectsPage({ searchParams }: PageProps) {
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

	const projects = await getWorkspaceProjects(currentWorkspace.id);

	return (
		<div className="flex flex-col h-full">
			<div className="flex-1 p-6">
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-white">Projects</h1>
					<p className="text-white/60 mt-1">
						Manage your workspace projects and track progress
					</p>
				</div>
				<ProjectsList initialProjects={projects} workspaceId={currentWorkspace.id} />
			</div>
		</div>
	);
}
