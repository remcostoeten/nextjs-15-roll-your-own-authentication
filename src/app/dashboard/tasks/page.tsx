import { getTasks } from '@/features/tasks/actions/get-tasks'
import { TaskList } from '@/features/tasks/components/task-list'
import { Suspense } from 'react'

export const revalidate = 0 // Disable caching for this page

export default async function TasksPage() {
	const tasks = await getTasks()

	return (
		<div className="container mx-auto py-8">
			<Suspense fallback={<div>Loading tasks...</div>}>
				<TaskList initialTasks={tasks} />
			</Suspense>
		</div>
	)
}
