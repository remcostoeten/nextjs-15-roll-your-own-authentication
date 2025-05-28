import { getSession } from '@/modules/authenticatie/helpers/session';
import { TasksList } from '@/modules/tasks/ui/tasks-list';
import { getUserWorkspaces } from '@/modules/workspaces/server/queries/get-user-workspaces';
import { redirect } from 'next/navigation';

interface TasksPageProps {
	searchParams?: Promise<{ workspace?: string; project?: string; status?: string }>;
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
	const resolvedSearchParams = await searchParams;
	const session = await getSession();
	if (!session) {
		redirect('/login');
	}

	const workspaces = await getUserWorkspaces();
	if (workspaces.length === 0) {
		redirect('/onboarding/workspace');
	}

	// Find current workspace from search params or default to first
	const workspaceId = resolvedSearchParams?.workspace;
	const currentWorkspace = workspaceId
		? workspaces.find(w => w.id === workspaceId) || workspaces[0]
		: workspaces[0];

	// TODO: Get tasks from database
	// For now, we'll use mock data
	const mockTasks = [
		{
			id: '1',
			title: 'Design new landing page',
			description: 'Create a modern, responsive landing page for the product',
			status: 'in_progress' as const,
			priority: 'high' as const,
			assigneeId: session.id,
			projectId: 'project-1',
			workspaceId: currentWorkspace.id,
			createdAt: new Date('2024-01-15'),
			updatedAt: new Date('2024-01-16'),
			dueDate: new Date('2024-01-25'),
			assignee: {
				id: session.id,
				name: session.name || 'You',
				email: session.email,
				avatar: null,
			},
			project: {
				id: 'project-1',
				title: 'Website Redesign',
				emoji: '🎨',
			},
		},
		{
			id: '2',
			title: 'Set up authentication system',
			description: 'Implement OAuth with Google and GitHub',
			status: 'completed' as const,
			priority: 'medium' as const,
			assigneeId: session.id,
			projectId: 'project-2',
			workspaceId: currentWorkspace.id,
			createdAt: new Date('2024-01-10'),
			updatedAt: new Date('2024-01-14'),
			dueDate: new Date('2024-01-20'),
			assignee: {
				id: session.id,
				name: session.name || 'You',
				email: session.email,
				avatar: null,
			},
			project: {
				id: 'project-2',
				title: 'Backend Development',
				emoji: '⚙️',
			},
		},
		{
			id: '3',
			title: 'Write API documentation',
			description: 'Document all API endpoints with examples',
			status: 'todo' as const,
			priority: 'low' as const,
			assigneeId: session.id,
			projectId: 'project-2',
			workspaceId: currentWorkspace.id,
			createdAt: new Date('2024-01-12'),
			updatedAt: new Date('2024-01-12'),
			dueDate: new Date('2024-01-30'),
			assignee: {
				id: session.id,
				name: session.name || 'You',
				email: session.email,
				avatar: null,
			},
			project: {
				id: 'project-2',
				title: 'Backend Development',
				emoji: '⚙️',
			},
		},
	];

	return (
		<div className="flex-1 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-white mb-2">Tasks</h1>
					<p className="text-white/60">
						Manage and track your tasks across all projects.
					</p>
				</div>

				<TasksList
					initialTasks={mockTasks}
					workspace={currentWorkspace}
					filters={{
						project: resolvedSearchParams?.project,
						status: resolvedSearchParams?.status,
					}}
				/>
			</div>
		</div>
	);
}
