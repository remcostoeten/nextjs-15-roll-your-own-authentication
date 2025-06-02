'use client';

import { TProjectWithDetails } from '@/modules/workspaces/types';
import { toast } from '@/shared/components/toast';
import { useState, useTransition } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Icons } from 'ui';
import { createProject } from '../server/mutations/create-project';

type ProjectsListProps = {
	initialProjects: TProjectWithDetails[];
	workspaceId: string;
};

/**
 * Displays and manages a list of projects within a workspace, including project creation.
 *
 * Renders a grid of project cards with details, allows users to create new projects via a form, and provides feedback on creation success or failure.
 *
 * @param initialProjects - The initial list of projects to display.
 * @param workspaceId - The identifier of the current workspace.
 */
export function ProjectsList({ initialProjects, workspaceId }: ProjectsListProps) {
	const [projects, setProjects] = useState(initialProjects);
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [isCreating, startCreating] = useTransition();

	const handleCreateProject = async (formData: FormData) => {
		// Add workspaceId to form data
		formData.append('workspaceId', workspaceId);

		startCreating(async () => {
			try {
				const result = await createProject(formData);
				if (result.success && result.data) {
					// Add new project to list (with mock details for display)
					const newProject: TProjectWithDetails = {
						...result.data,
						owner: { id: '', name: 'You', email: '', avatar: null },
						workspace: { id: workspaceId, title: '', emoji: '' },
						taskCount: 0,
						completedTaskCount: 0,
					};
					setProjects((prev) => [newProject, ...prev]);
					setShowCreateForm(false);
					toast.success('Project created successfully');
				} else {
					toast.error(result.error || 'Failed to create project');
				}
			} catch (error) {
				toast.error('Failed to create project');
			}
		});
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h2 className="text-lg font-semibold text-white">
						{projects.length} Project{projects.length !== 1 ? 's' : ''}
					</h2>
				</div>
				<Button
					onClick={() => setShowCreateForm(!showCreateForm)}
					className="bg-white text-black hover:bg-white/90"
				>
					<Icons.plus className="w-4 h-4 mr-2" />
					New Project
				</Button>
			</div>

			{showCreateForm && (
				<Card className="bg-[rgb(15,15,15)] border-[rgb(28,28,28)]">
					<CardHeader>
						<CardTitle className="text-white">Create New Project</CardTitle>
					</CardHeader>
					<CardContent>
						<form action={handleCreateProject} className="space-y-4">
							<div className="flex space-x-3">
								<input
									name="emoji"
									type="text"
									placeholder="📋"
									maxLength={2}
									className="w-16 bg-[rgb(21,21,21)] border border-[rgb(28,28,28)] rounded px-3 py-2 text-center text-white"
									defaultValue="📋"
								/>
								<input
									name="title"
									type="text"
									placeholder="Project name"
									required
									className="flex-1 bg-[rgb(21,21,21)] border border-[rgb(28,28,28)] rounded px-3 py-2 text-white placeholder:text-white/40"
								/>
							</div>
							<textarea
								name="description"
								placeholder="Project description (optional)"
								rows={3}
								className="w-full bg-[rgb(21,21,21)] border border-[rgb(28,28,28)] rounded px-3 py-2 text-white placeholder:text-white/40 resize-none"
							/>
							<div className="flex space-x-3">
								<Button
									type="button"
									variant="outline"
									onClick={() => setShowCreateForm(false)}
									className="border-[rgb(28,28,28)] text-white/70 hover:text-white hover:bg-white/5"
								>
									Cancel
								</Button>
								<Button
									type="submit"
									disabled={isCreating}
									className="bg-white text-black hover:bg-white/90"
								>
									{isCreating ? (
										<>
											<Icons.spinner className="w-4 h-4 animate-spin mr-2" />
											Creating...
										</>
									) : (
										'Create Project'
									)}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			)}

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{projects.map((project) => (
					<Card
						key={project.id}
						className="bg-[rgb(15,15,15)] border-[rgb(28,28,28)] hover:border-[rgb(40,40,40)] transition-colors cursor-pointer"
					>
						<CardHeader className="pb-3">
							<div className="flex items-start justify-between">
								<div className="flex items-center space-x-2">
									<span className="text-lg">{project.emoji}</span>
									<CardTitle className="text-white text-base">
										{project.title}
									</CardTitle>
								</div>
								<div
									className={`px-2 py-1 rounded-full text-xs font-medium ${
										project.status === 'active'
											? 'bg-green-500/20 text-green-400'
											: project.status === 'completed'
											  ? 'bg-blue-500/20 text-blue-400'
											  : project.status === 'on_hold'
												  ? 'bg-yellow-500/20 text-yellow-400'
												  : 'bg-gray-500/20 text-gray-400'
									}`}
								>
									{project.status.replace('_', ' ')}
								</div>
							</div>
						</CardHeader>
						<CardContent>
							{project.description && (
								<p className="text-white/60 text-sm mb-4 line-clamp-2">
									{project.description}
								</p>
							)}
							<div className="flex items-center justify-between text-sm">
								<div className="flex items-center space-x-4">
									<span className="text-white/60">
										{project.completedTaskCount}/{project.taskCount} tasks
									</span>
								</div>
								<div className="flex items-center space-x-2 text-white/60">
									<div className="text-xs">
										{new Date(project.createdAt).toLocaleDateString()}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{projects.length === 0 && !showCreateForm && (
				<div className="text-center py-12">
					<div className="text-6xl mb-4">📋</div>
					<h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
					<p className="text-white/60 mb-6">
						Create your first project to get started organizing your work.
					</p>
					<Button
						onClick={() => setShowCreateForm(true)}
						className="bg-white text-black hover:bg-white/90"
					>
						<Icons.plus className="w-4 h-4 mr-2" />
						Create Your First Project
					</Button>
				</div>
			)}
		</div>
	);
}
