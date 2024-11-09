'use client'

import { updateTaskPositions } from '@/features/tasks/actions/update-position'
import { updateTaskStatus as updateTaskStatusAction } from '@/features/tasks/actions/update-task'
import { TaskCrudMenu } from '@/features/tasks/components/task-crud-menu'
import type { Task } from '@/features/tasks/db/schema'
import { AnimatePresence, motion, PanInfo } from 'framer-motion'
import { Calendar, ChevronDown, ChevronUp, Clock } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { useTaskStore } from './task-store'

/**
 * TaskReminder Component
 *
 * This component displays a sticky note-style task reminder that can be expanded
 * to show a list of tasks. Tasks can be reordered via drag and drop using Framer Motion,
 * and each task can be expanded to show more details.
 *
 * Features:
 * - Expandable sticky note UI
 * - Task list with drag and drop reordering using Framer Motion
 * - Individual task expansion for more details
 * - Due date display
 * - Time spent tracking
 * - Priority levels
 * - Task status (todo, in-progress, done)
 * - Animations for smooth transitions and dragging
 */
export default function TaskReminder() {
	const { tasks, reorderTasks, updateTask } = useTaskStore()
	const [isOpen, setIsOpen] = useState(false)
	const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null)
	const constraintsRef = useRef<HTMLUListElement>(null)

	const toggleTaskExpansion = (id: string) => {
		updateTask(id, {
			isExpanded: !tasks.find((t) => t.id === id)?.isExpanded
		})
	}

	const updateTaskStatus = async (id: string, status: Task['status']) => {
		try {
			const result = await updateTaskStatusAction(id, status)
			if (result.success) {
				updateTask(id, { status })
				toast.success('Status updated')
			} else {
				toast.error('Failed to update status')
			}
		} catch (error) {
			console.error('Failed to update task status:', error)
			toast.error('Failed to update status')
		}
	}

	const findTaskIndex = (y: number) => {
		if (!constraintsRef.current) return 0

		const taskElements = Array.from(
			constraintsRef.current.children
		) as HTMLElement[]
		const distances = taskElements.map((element, index) => {
			const box = element.getBoundingClientRect()
			const taskMiddle = box.top + box.height / 2
			return { index, distance: Math.abs(y - taskMiddle) }
		})

		return distances.reduce((prev, curr) =>
			curr.distance < prev.distance ? curr : prev
		).index
	}

	const handleDragEnd = async (taskId: string, info: PanInfo) => {
		setDraggingTaskId(null)
		const targetIndex = findTaskIndex(info.point.y)
		const sourceIndex = tasks.findIndex((t) => t.id === taskId)

		if (sourceIndex !== targetIndex) {
			const newTasks = Array.from(tasks)
			const [movedTask] = newTasks.splice(sourceIndex, 1)
			newTasks.splice(targetIndex, 0, movedTask)

			// Optimistic update
			reorderTasks(newTasks)

			// Update positions in database
			const updates = newTasks.map((task, index) => ({
				id: task.id,
				position: index
			}))

			try {
				const result = await updateTaskPositions(updates)
				if (!result.success) {
					// Revert on error
					reorderTasks(tasks)
					toast.error('Failed to update positions')
				}
			} catch (error) {
				console.error('Failed to update task positions:', error)
				reorderTasks(tasks) // Revert on error
				toast.error('Failed to update positions')
			}
		}
	}

	return (
		<motion.div
			className="fixed bottom-4 right-4 z-50"
			initial={{ scale: 0 }}
			animate={{ scale: 1 }}
			transition={{ type: 'spring', stiffness: 260, damping: 20 }}
		>
			<AnimatePresence>
				{!isOpen ? (
					<motion.button
						key="closed"
						onClick={() => setIsOpen(true)}
						className="w-16 h-16 bg-yellow-200 rounded-full shadow-lg flex items-center justify-center hover:bg-yellow-300 transition-colors duration-200"
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
					>
						<span className="text-3xl">📝</span>
					</motion.button>
				) : (
					<motion.div
						key="open"
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 50 }}
						className="bg-yellow-200 p-4 rounded-lg shadow-lg max-w-md w-full"
						style={{
							maxHeight: 'calc(100vh - 2rem)',
							overflowY: 'auto'
						}}
					>
						<div className="flex justify-between items-center mb-4 sticky top-0 bg-yellow-200 p-2 z-10">
							<h3 className="text-2xl font-medium text-gray-800">
								Tasks
							</h3>
							<TaskCrudMenu />
						</div>
						<ul ref={constraintsRef} className="space-y-4">
							{tasks.map((task, index) => (
								<motion.li
									key={task.id}
									layoutId={task.id}
									drag="y"
									dragConstraints={constraintsRef}
									dragElastic={0.1}
									dragMomentum={false}
									onDragStart={() =>
										setDraggingTaskId(task.id)
									}
									onDragEnd={(_, info) =>
										handleDragEnd(task.id, info)
									}
									className={`task-item bg-white rounded-md shadow-sm p-3 cursor-move ${
										draggingTaskId === task.id
											? 'z-10 shadow-lg'
											: ''
									}`}
								>
									<div className="flex justify-between items-center gap-2">
										<span className="text-sm text-gray-500 min-w-[2rem]">
											#{index + 1}
										</span>
										<div className="flex-1">
											<h4 className="text-lg font-medium text-gray-800">
												{task.title}
											</h4>
											<div className="flex gap-2 mt-1">
												<span
													className={`px-2 py-0.5 rounded-full text-xs ${
														task.priority === 'high'
															? 'bg-red-200 text-red-800'
															: task.priority ===
																  'medium'
																? 'bg-yellow-200 text-yellow-800'
																: 'bg-green-200 text-green-800'
													}`}
												>
													{task.priority}
												</span>
												<span
													className={`px-2 py-0.5 rounded-full text-xs ${
														task.status === 'done'
															? 'bg-green-200 text-green-800'
															: task.status ===
																  'in-progress'
																? 'bg-blue-200 text-blue-800'
																: 'bg-gray-200 text-gray-800'
													}`}
												>
													{task.status.replace(
														'-',
														' '
													)}
												</span>
											</div>
										</div>
										<button
											onClick={() =>
												toggleTaskExpansion(task.id)
											}
										>
											{task.isExpanded ? (
												<ChevronUp size={20} />
											) : (
												<ChevronDown size={20} />
											)}
										</button>
									</div>
									<AnimatePresence>
										{task.isExpanded && (
											<motion.div
												initial={{
													opacity: 0,
													height: 0
												}}
												animate={{
													opacity: 1,
													height: 'auto'
												}}
												exit={{ opacity: 0, height: 0 }}
												className="mt-2 space-y-2"
											>
												<p className="text-sm text-gray-600">
													{task.description}
												</p>
												<div className="flex items-center space-x-2 text-sm text-gray-600">
													<Calendar size={16} />
													<span>
														Due: {task.dueDate}
													</span>
												</div>
												<div className="flex items-center space-x-2 text-sm text-gray-600">
													<Clock size={16} />
													<span>
														Time spent:{' '}
														{task.timeSpent} min
													</span>
												</div>
												<div className="flex items-center space-x-2">
													<select
														value={task.status}
														onChange={(e) =>
															updateTaskStatus(
																task.id,
																e.target
																	.value as Task['status']
															)
														}
														className="text-sm border rounded px-2 py-1 bg-white text-gray-800"
													>
														<option value="todo">
															To Do
														</option>
														<option value="in-progress">
															In Progress
														</option>
														<option value="done">
															Done
														</option>
													</select>
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</motion.li>
							))}
						</ul>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	)
}
