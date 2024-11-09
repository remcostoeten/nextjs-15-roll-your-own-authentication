'use client'

import { create } from 'zustand'

export type Task = {
	id: string
	title: string
	description: string
	dueDate: string
	timeSpent: number
	priority: 'low' | 'medium' | 'high'
	status: 'todo' | 'in-progress' | 'done'
	isExpanded: boolean
	order: number
}

type TaskStore = {
	tasks: Task[]
	setTasks: (tasks: Task[]) => void
	reorderTasks: (newTasks: Task[]) => void
	updateTask: (id: string, updates: Partial<Task>) => void
}

export const useTaskStore = create<TaskStore>((set) => ({
	tasks: [],
	setTasks: (tasks) => set({ tasks }),
	reorderTasks: (newTasks) => {
		const reorderedTasks = newTasks.map((task, index) => ({
			...task,
			order: index
		}))
		set({ tasks: reorderedTasks })
	},
	updateTask: (id, updates) =>
		set((state) => ({
			tasks: state.tasks.map((task) =>
				task.id === id ? { ...task, ...updates } : task
			)
		}))
}))

// Helper hook to get sorted tasks
export function useSortedTasks() {
	const tasks = useTaskStore((state) => state.tasks)
	return tasks.sort((a, b) => a.order - b.order)
}
