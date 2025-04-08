type Task = {
	id: string
	title: string
	description: string | null
	status: string
	priority: string
	dueDate: Date | null
	createdAt: Date
	updatedAt: Date
	completedAt: Date | null
	assignee: {
		id: string
		firstName: string
		lastName: string
		avatar: string | null
	} | null
}

type Member = {
	id: string
	role: string
	joinedAt: Date
	user: {
		id: string
		firstName: string
		lastName: string
		email: string
		username: string
		avatar: string | null
	}
}

interface TaskListProps {
	workspaceId: string
	tasks: Task[]
	members: Member[]
}

export type { Task, Member, TaskListProps }