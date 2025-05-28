import { redirect } from 'next/navigation';
import { getSession } from '@/modules/authenticatie/helpers/session';
import { getWorkspaceProjects } from '@/modules/projects/server/queries/get-workspace-projects';
import { ProjectsList } from '@/modules/projects/ui/projects-list';

type PageProps = {
	searchParams: { workspace?: string };
};

export default async function ProjectsPage({ searchParams }: PageProps) {
	const session = await getSession();
	if (!session) {
		redirect('/login');
	}

	const workspaceId = searchParams.workspace;
	if (!workspaceId) {
		redirect('/dashboard');
	}

	const projects = await getWorkspaceProjects(workspaceId);

	return (
		<div className="flex flex-col h-full">
			<div className="flex-1 p-6">
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-white">Projects</h1>
					<p className="text-white/60 mt-1">
						Manage your workspace projects and track progress
					</p>
				</div>
				<ProjectsList initialProjects={projects} workspaceId={workspaceId} />
			</div>
		</div>
	);
}

