import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type Todo, type TodoPosition, type TodoSize, type TodoStore } from '../types'

export const useTodoStore = create<TodoStore>()(
	persist(
		(set, get) => ({
			todos: [],
			position: { x: 20, y: 20 },
			size: { width: 320, height: 400 },
			isCollapsed: false,
			isVisible: true,
			isLocked: false,
			opacity: 1,
			title: 'Dev Todo List',

			addTodo: (title) =>
				set((state) => ({
					todos: [
						{
							id: crypto.randomUUID(),
							title,
							completed: false,
							createdAt: new Date().toISOString(),
						},
						...state.todos,
					],
				})),

			updateTodo: (id, updates) =>
				set((state) => ({
					todos: state.todos.map((todo) =>
						todo.id === id ? { ...todo, ...updates } : todo
					),
				})),

			deleteTodo: (id) =>
				set((state) => ({
					todos: state.todos.filter((todo) => todo.id !== id),
				})),

			toggleTodoCompletion: (id) =>
				set((state) => ({
					todos: state.todos.map((todo) =>
						todo.id === id
							? { ...todo, completed: !todo.completed }
							: todo
					),
				})),

			setPosition: (position) => set(() => ({ position })),

			setSize: (size) => set(() => ({ size })),

			toggleCollapse: () =>
				set((state) => ({ isCollapsed: !state.isCollapsed })),

			toggleVisibility: () =>
				set((state) => ({ isVisible: !state.isVisible })),

			toggleLock: () => set((state) => ({ isLocked: !state.isLocked })),

			setOpacity: (opacity) => set(() => ({ opacity })),

			setTitle: (title) => set(() => ({ title })),

			exportToJson: () => {
				const state = get()
				const exportData = {
					todos: state.todos,
					position: state.position,
					size: state.size,
					title: state.title,
					isCollapsed: state.isCollapsed,
					isVisible: state.isVisible,
					isLocked: state.isLocked,
					opacity: state.opacity,
				}

				const blob = new Blob([JSON.stringify(exportData, null, 2)], {
					type: 'application/json',
				})

				const url = URL.createObjectURL(blob)
				const link = document.createElement('a')
				link.href = url
				link.download = `${state.title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`
				document.body.appendChild(link)
				link.click()

				document.body.removeChild(link)
				URL.revokeObjectURL(url)
			},

			importFromJson: async (file: File) => {
				return new Promise<void>((resolve, reject) => {
					const reader = new FileReader()

					reader.onload = (event) => {
						try {
							const result = event.target?.result
							if (typeof result === 'string') {
								const importedData = JSON.parse(result)

								if (
									!importedData.todos ||
									!Array.isArray(importedData.todos)
								) {
									throw new Error(
										'Invalid JSON format: missing todos array'
									)
								}

								set({
									todos: importedData.todos,
									position: importedData.position || {
										x: 20,
										y: 20,
									},
									size: importedData.size || {
										width: 320,
										height: 400,
									},
									title:
										importedData.title || 'Dev Todo List',
									isCollapsed:
										importedData.isCollapsed ?? false,
									isVisible: importedData.isVisible ?? true,
									isLocked: importedData.isLocked ?? false,
									opacity: importedData.opacity ?? 1,
								})

								resolve()
							}
						} catch (error) {
							reject(error)
						}
					}

					reader.onerror = () => {
						reject(new Error('Failed to read the file'))
					}

					reader.readAsText(file)
				})
			},
		}),
		{
			name: 'floating-todo-storage',
		}
	)
) 