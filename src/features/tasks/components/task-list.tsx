'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
	DragDropContext,
	Draggable,
	Droppable,
	DropResult
} from 'react-beautiful-dnd'
import { toast } from 'sonner'
import { updateTaskPositions } from '../actions/update-position'
import type { Task } from '../db/schema'
import { CreateTaskDialog } from './create-task-dialog'

type TaskListProps = {
	initialTasks: Task[]
}

export function TaskList({ initialTasks }: TaskListProps) {
	const router = useRouter()
	const [tasks, setTasks] = useState(initialTasks)

	const onDragEnd = async (result: DropResult) => {
		if (!result.destination) return

		const items = Array.from(tasks)
		const [reorderedItem] = items.splice(result.source.index, 1)
		items.splice(result.destination.index, 0, reorderedItem)

		setTasks(items) // Optimistic update

		const updates = items.map((task, index) => ({
			id: task.id,
			position: index
		}))

		const response = await updateTaskPositions(updates)
		if (!response.success) {
			setTasks(initialTasks) // Revert on error
			toast.error('Failed to update positions')
		}

		router.refresh() // Refresh the page data
	}

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h2 className="text-xl font-bold">Tasks</h2>
				<CreateTaskDialog />
			</div>

			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="tasks">
					{(provided) => (
						<ul
							{...provided.droppableProps}
							ref={provided.innerRef}
							className="space-y-2"
						>
							{tasks?.map((task, index) => (
								<Draggable
									key={task.id}
									draggableId={task.id}
									index={index}
								>
									{(provided) => (
										<li
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
											className="bg-white p-4 rounded-lg shadow"
										>
											<h3 className="font-medium">
												{task.title}
											</h3>
											{task.description && (
												<p className="text-gray-600">
													{task.description}
												</p>
											)}
											<div className="flex gap-2 mt-2">
												<span
													className={`px-2 py-1 rounded-full text-xs ${
														task.priority === 'high'
															? 'bg-red-100 text-red-800'
															: task.priority ===
																  'medium'
																? 'bg-yellow-100 text-yellow-800'
																: 'bg-green-100 text-green-800'
													}`}
												>
													{task.priority}
												</span>
												<span
													className={`px-2 py-1 rounded-full text-xs ${
														task.status === 'done'
															? 'bg-green-100 text-green-800'
															: task.status ===
																  'in-progress'
																? 'bg-blue-100 text-blue-800'
																: 'bg-gray-100 text-gray-800'
													}`}
												>
													{task.status}
												</span>
											</div>
										</li>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</ul>
					)}
				</Droppable>
			</DragDropContext>
		</div>
	)
}
