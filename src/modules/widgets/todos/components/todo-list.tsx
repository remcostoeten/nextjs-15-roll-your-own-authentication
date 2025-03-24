'use client'

import { useState } from 'react'
import { Tag, Filter, SortAsc } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { type Todo } from '@/server/db/schemas/widget-todos'
import { deleteTodoMutation } from '../api/mutations/delete-todo'
import { updateTodoMutation } from '../api/mutations/update-todo'
import { toggleTodoMutation } from '../api/mutations/toggle-todo'

type SortOption = 'createdAt' | 'priority' | 'title'
type FilterOption = 'all' | 'completed' | 'active'

interface TodoListProps {
	todos: Todo[]
}

export function TodoList({ todos }: TodoListProps) {
	const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
	const [editingId, setEditingId] = useState<string | null>(null)
	const [editValue, setEditValue] = useState('')
	const [sortBy, setSortBy] = useState<SortOption>('createdAt')
	const [filterBy, setFilterBy] = useState<FilterOption>('all')
	const [selectedTags, setSelectedTags] = useState<string[]>([])

	// Extract unique tags from all todos
	const allTags = Array.from(new Set(todos.flatMap((todo) => JSON.parse(todo.tags))))

	// Filter and sort todos
	const filteredAndSortedTodos = todos
		.filter((todo) => {
			if (filterBy === 'completed') return todo.completed
			if (filterBy === 'active') return !todo.completed
			return true
		})
		.filter((todo) => {
			if (selectedTags.length === 0) return true
			const todoTags = JSON.parse(todo.tags)
			return selectedTags.every((tag) => todoTags.includes(tag))
		})
		.sort((a, b) => {
			if (sortBy === 'priority') return b.priority - a.priority
			if (sortBy === 'title') return a.title.localeCompare(b.title)
			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		})

	const handleDelete = async (id: string) => {
		setDeleteLoading(id)
		try {
			await deleteTodoMutation(id)
			// Optimistically remove the todo from the list
			todos = todos.filter((todo) => todo.id !== id)
		} catch (error) {
			console.error('Failed to delete todo:', error)
		} finally {
			setDeleteLoading(null)
		}
	}

	const startEdit = (todo: Todo) => {
		setEditingId(todo.id)
		setEditValue(todo.title)
	}

	const handleUpdate = async (id: string) => {
		if (!editValue.trim()) return
		try {
			const formData = new FormData()
			formData.append('title', editValue)
			await updateTodoMutation(id, formData)
			// Optimistically update the todo title
			todos = todos.map((todo) => (todo.id === id ? { ...todo, title: editValue } : todo))
		} catch (error) {
			console.error('Failed to update todo:', error)
		} finally {
			setEditingId(null)
			setEditValue('')
		}
	}

	return (
		<div className="space-y-4">
			<div className="flex gap-4 items-center">
				<Select
					value={sortBy}
					onValueChange={(value: SortOption) => setSortBy(value)}
				>
					<SelectTrigger className="w-[180px]">
						<SortAsc className="w-4 h-4 mr-2" />
						<SelectValue placeholder="Sort by" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="createdAt">Date</SelectItem>
						<SelectItem value="priority">Priority</SelectItem>
						<SelectItem value="title">Title</SelectItem>
					</SelectContent>
				</Select>
				<Select
					value={filterBy}
					onValueChange={(value: FilterOption) => setFilterBy(value)}
				>
					<SelectTrigger className="w-[180px]">
						<Filter className="w-4 h-4 mr-2" />
						<SelectValue placeholder="Filter by" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All</SelectItem>
						<SelectItem value="completed">Completed</SelectItem>
						<SelectItem value="active">Active</SelectItem>
					</SelectContent>
				</Select>
				<div className="flex gap-2">
					{allTags.map((tag) => (
						<Button
							key={tag}
							size="sm"
							variant={selectedTags.includes(tag) ? 'default' : 'outline'}
							onClick={() =>
								setSelectedTags((prev) =>
									prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
								)
							}
						>
							<Tag className="w-4 h-4 mr-2" />
							{tag}
						</Button>
					))}
				</div>
			</div>

			<ul className="space-y-2">
				{filteredAndSortedTodos.map((todo) => (
					<li
						key={todo.id}
						className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
					>
						<input
							type="checkbox"
							checked={todo.completed}
							onChange={() => toggleTodoMutation(todo.id)}
							className="w-4 h-4"
						/>
						{editingId === todo.id ? (
							<Input
								value={editValue}
								onChange={(e) => setEditValue(e.target.value)}
								onKeyDown={(e) => e.key === 'Enter' && handleUpdate(todo.id)}
								onBlur={() => handleUpdate(todo.id)}
								autoFocus
							/>
						) : (
							<span
								className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}
								onDoubleClick={() => startEdit(todo)}
							>
								{todo.title}
							</span>
						)}
						<div className="flex gap-2">
							<Button
								size="sm"
								variant="ghost"
								onClick={() => startEdit(todo)}
							>
								Edit
							</Button>
							<Button
								size="sm"
								variant="destructive"
								onClick={() => handleDelete(todo.id)}
								disabled={deleteLoading === todo.id}
							>
								{deleteLoading === todo.id ? 'Deleting...' : 'Delete'}
							</Button>
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}
