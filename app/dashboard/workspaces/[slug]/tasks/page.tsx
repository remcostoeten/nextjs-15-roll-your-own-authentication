import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import {
	getWorkspaceBySlug,
	getWorkspaceMembers,
} from '@/modules/workspaces/api/queries'
import { getWorkspaceTasks } from '@/modules/tasks/api/queries/queries'
import { requireAuth } from '@/modules/authentication/utilities/auth'
import { TaskList } from '@/modules/tasks/components/task-list'

type TProps = {
	params: {
		slug: string
	}
}

export default async function TasksPage({ params }: TProps) {
	const user = await requireAuth()
	const workspace = await getWorkspaceBySlug(params.slug)

	if (!workspace) {
		notFound()
	}

	const tasks = await getWorkspaceTasks(workspace.id)
	const members = await getWorkspaceMembers(workspace.id)

	return (
		<div className="container py-6">
			<Suspense fallback={<div>Loading tasks...</div>}>
				<TaskList
					workspaceId={workspace.id}
					tasks={tasks}
					members={members}
				/>
			</Suspense>
		</div>
	)
}
