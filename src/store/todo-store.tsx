import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Todo {
	id: string
	title: string
	notes?: string
	richContent?: string // For rich text content
	completed: boolean
	createdAt: string
}

interface TodoPosition {
	x: number
	y: number
}

interface TodoSize {
	width: number
	height: number
}

interface TodoStore {
	todos: Todo[]
	position: TodoPosition
	size: TodoSize
	isCollapsed: boolean
	isVisible: boolean
	isLocked: boolean
	opacity: number
	title: string

	// CRUD operations
	addTodo: (title: string) => void
	updateTodo: (
		id: string,
		updates: Partial<Omit<Todo, 'id' | 'createdAt'>>
	) => void
	deleteTodo: (id: string) => void
	toggleTodoCompletion: (id: string) => void

	// UI state
	setPosition: (position: TodoPosition) => void
	setSize: (size: TodoSize) => void
	toggleCollapse: () => void
	toggleVisibility: () => void
	toggleLock: () => void
	setOpacity: (opacity: number) => void
	setTitle: (title: string) => void

	// Import/Export functions
	exportToJson: () => void
	importFromJson: (file: File) => Promise<void>
}

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

			// Export/Import functionality
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

				// Create a Blob with the JSON data
				const blob = new Blob([JSON.stringify(exportData, null, 2)], {
					type: 'application/json',
				})

				// Create a download link and trigger the download
				const url = URL.createObjectURL(blob)
				const link = document.createElement('a')
				link.href = url
				link.download = `${state.title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`
				document.body.appendChild(link)
				link.click()

				// Clean up
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

								// Validate the imported data has the expected structure
								if (
									!importedData.todos ||
									!Array.isArray(importedData.todos)
								) {
									throw new Error(
										'Invalid JSON format: missing todos array'
									)
								}

								// Update the store with the imported data
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
