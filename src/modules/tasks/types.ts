export type TTaskStatus = 'todo' | 'in_progress' | 'completed' | 'cancelled';
export type TTaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TTask = {
	id: string;
	title: string;
	description: string | null;
	status: TTaskStatus;
	priority: TTaskPriority;
	assigneeId: string | null;
	projectId: string;
	workspaceId: string;
	createdAt: Date;
	updatedAt: Date;
	dueDate: Date | null;
};

export type TTaskWithDetails = TTask & {
	assignee: {
		id: string;
		name: string;
		email: string;
		avatar: string | null;
	} | null;
	project: {
		id: string;
		title: string;
		emoji: string;
	};
};

export type TCreateTaskData = {
	title: string;
	description?: string;
	priority: TTaskPriority;
	projectId: string;
	assigneeId?: string;
	dueDate?: Date;
};

export type TUpdateTaskData = Partial<TCreateTaskData> & {
	status?: TTaskStatus;
};
