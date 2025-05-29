'use client';

import { TWorkspaceWithOwner } from '@/modules/workspaces/types';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Icons } from '@/shared/components/ui/icons';
import { useMemo, useState } from 'react';
import { TTaskPriority, TTaskStatus, TTaskWithDetails } from '../types';


interface TasksListProps {
	initialTasks: TTaskWithDetails[];
	workspace: TWorkspaceWithOwner;
	filters?: {
		project?: string;
		status?: string;
	};
}

export function TasksList({ initialTasks, workspace, filters }: TasksListProps) {
	const [tasks, setTasks] = useState(initialTasks);
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [statusFilter, setStatusFilter] = useState<TTaskStatus | 'all'>(
		(filters?.status as TTaskStatus) || 'all'
	);
	const [priorityFilter, setPriorityFilter] = useState<TTaskPriority | 'all'>('all');

	// Filter tasks based on current filters
	const filteredTasks = useMemo(() => {
		return tasks.filter(task => {
			if (statusFilter !== 'all' && task.status !== statusFilter) return false;
			if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
			if (filters?.project && task.projectId !== filters.project) return false;
			return true;
		});
	}, [tasks, statusFilter, priorityFilter, filters?.project]);

	// Group tasks by status for kanban view
	const tasksByStatus = useMemo(() => {
		const groups: Record<TTaskStatus, TTaskWithDetails[]> = {
			todo: [],
			in_progress: [],
			completed: [],
			cancelled: [],
		};

		filteredTasks.forEach(task => {
			groups[task.status].push(task);
		});

		return groups;
	}, [filteredTasks]);

	const getStatusColor = (status: TTaskStatus) => {
		switch (status) {
			case 'todo':
				return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
			case 'in_progress':
				return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
			case 'completed':
				return 'bg-green-500/20 text-green-400 border-green-500/30';
			case 'cancelled':
				return 'bg-red-500/20 text-red-400 border-red-500/30';
			default:
				return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
		}
	};

	const getPriorityColor = (priority: TTaskPriority) => {
		switch (priority) {
			case 'low':
				return 'text-green-400';
			case 'medium':
				return 'text-yellow-400';
			case 'high':
				return 'text-orange-400';
			case 'urgent':
				return 'text-red-400';
			default:
				return 'text-gray-400';
		}
	};

	const getPriorityIcon = (priority: TTaskPriority) => {
		switch (priority) {
			case 'low':
				return Icons.chevronDown;
			case 'medium':
				return Icons.chevronRight;
			case 'high':
				return Icons.chevronUp;
			case 'urgent':
				return Icons.alertTriangle;
			default:
				return Icons.chevronRight;
		}
	};

	const statusLabels: Record<TTaskStatus, string> = {
		todo: 'To Do',
		in_progress: 'In Progress',
		completed: 'Completed',
		cancelled: 'Cancelled',
	};

	return (
		<div className="space-y-6">
			{/* Header with filters and create button */}
			<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
				<div className="flex flex-wrap gap-3">
					{/* Status Filter */}
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value as TTaskStatus | 'all')}
						className="px-3 py-2 bg-[rgb(21,21,21)] border border-[rgb(28,28,28)] rounded-lg text-white text-sm focus:outline-none focus:border-white/40"
					>
						<option value="all">All Status</option>
						<option value="todo">To Do</option>
						<option value="in_progress">In Progress</option>
						<option value="completed">Completed</option>
						<option value="cancelled">Cancelled</option>
					</select>

					{/* Priority Filter */}
					<select
						value={priorityFilter}
						onChange={(e) => setPriorityFilter(e.target.value as TTaskPriority | 'all')}
						className="px-3 py-2 bg-[rgb(21,21,21)] border border-[rgb(28,28,28)] rounded-lg text-white text-sm focus:outline-none focus:border-white/40"
					>
						<option value="all">All Priority</option>
						<option value="low">Low</option>
						<option value="medium">Medium</option>
						<option value="high">High</option>
						<option value="urgent">Urgent</option>
					</select>
				</div>

				<Button
					onClick={() => setShowCreateForm(true)}
					className="bg-white text-black hover:bg-white/90"
				>
					<Icons.plus className="h-4 w-4 mr-2" />
					New Task
				</Button>
			</div>

			{/* Task Stats */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{Object.entries(tasksByStatus).map(([status, statusTasks]) => (
					<Card key={status} className="bg-[rgb(15,15,15)] border-[rgb(28,28,28)]">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-white/60">{statusLabels[status as TTaskStatus]}</p>
									<p className="text-2xl font-bold text-white">{statusTasks.length}</p>
								</div>
								<div className={`w-3 h-3 rounded-full ${getStatusColor(status as TTaskStatus).split(' ')[0]}`} />
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Kanban Board */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{Object.entries(tasksByStatus).map(([status, statusTasks]) => (
					<div key={status} className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="font-medium text-white flex items-center gap-2">
								<div className={`w-3 h-3 rounded-full ${getStatusColor(status as TTaskStatus).split(' ')[0]}`} />
								{statusLabels[status as TTaskStatus]}
								<span className="text-white/60 text-sm">({statusTasks.length})</span>
							</h3>
						</div>

						<div className="space-y-3">
							{statusTasks.map((task) => {
								const PriorityIcon = getPriorityIcon(task.priority);
								return (
									<Card
										key={task.id}
										className="bg-[rgb(15,15,15)] border-[rgb(28,28,28)] hover:border-[rgb(40,40,40)] transition-colors cursor-pointer"
									>
										<CardContent className="p-4">
											<div className="space-y-3">
												{/* Task header */}
												<div className="flex items-start justify-between">
													<h4 className="font-medium text-white text-sm line-clamp-2">
														{task.title}
													</h4>
													<PriorityIcon className={`h-4 w-4 ${getPriorityColor(task.priority)} flex-shrink-0`} />
												</div>

												{/* Task description */}
												{task.description && (
													<p className="text-xs text-white/60 line-clamp-2">
														{task.description}
													</p>
												)}

												{/* Project badge */}
												<div className="flex items-center gap-2">
													<span className="text-xs">{task.project.emoji}</span>
													<span className="text-xs text-white/60 truncate">
														{task.project.title}
													</span>
												</div>

												{/* Task footer */}
												<div className="flex items-center justify-between pt-2 border-t border-[rgb(28,28,28)]">
													{/* Assignee */}
													{task.assignee && (
														<div className="flex items-center gap-2">
															<div className="w-6 h-6 bg-[rgb(28,28,28)] rounded-full flex items-center justify-center">
																{task.assignee.avatar ? (
																	<img
																		src={task.assignee.avatar}
																		alt={task.assignee.name}
																		className="w-6 h-6 rounded-full"
																	/>
																) : (
																	<span className="text-xs text-white font-medium">
																		{task.assignee.name.charAt(0).toUpperCase()}
																	</span>
																)}
															</div>
														</div>
													)}

													{/* Due date */}
													{task.dueDate && (
														<div className="text-xs text-white/60">
															{new Date(task.dueDate).toLocaleDateString()}
														</div>
													)}
												</div>
											</div>
										</CardContent>
									</Card>
								);
							})}
						</div>
					</div>
				))}
			</div>

			{/* Empty state */}
			{filteredTasks.length === 0 && (
				<div className="text-center py-12">
					<div className="text-6xl mb-4">📋</div>
					<h3 className="text-lg font-medium text-white mb-2">No tasks found</h3>
					<p className="text-white/60 mb-6">
						{tasks.length === 0
							? "Create your first task to get started organizing your work."
							: "Try adjusting your filters to see more tasks."
						}
					</p>
					<Button
						onClick={() => setShowCreateForm(true)}
						className="bg-white text-black hover:bg-white/90"
					>
						<Icons.plus className="h-4 w-4 mr-2" />
						Create Your First Task
					</Button>
				</div>
			)}

			{/* Create Task Modal - TODO: Implement */}
			{showCreateForm && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
					<Card className="bg-[rgb(15,15,15)] border-[rgb(28,28,28)] w-full max-w-md">
						<CardHeader>
							<CardTitle className="text-white">Create New Task</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-white/60 text-sm">
								Task creation form coming soon...
							</p>
							<div className="flex justify-end mt-4">
								<Button
									onClick={() => setShowCreateForm(false)}
									variant="ghost"
									className="text-white/60 hover:text-white"
								>
									Close
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
}
