export interface Todo {
    id: string
    title: string
    notes?: string
    richContent?: string
    completed: boolean
    createdAt: string
}

export interface TodoPosition {
    x: number
    y: number
}

export interface TodoSize {
    width: number
    height: number
}

export interface TodoStore {
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
    updateTodo: (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void
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