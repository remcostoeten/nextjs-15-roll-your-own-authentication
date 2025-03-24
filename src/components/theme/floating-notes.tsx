'use client'
import type React from 'react'
import { useState, useRef, useEffect } from 'react'

import { useTodoStore } from '@/modules/todos/state/todo-store'
import RichTextEditor from './rich-text-editor'
import {
	CheckCircle,
	Circle,
	ChevronUp,
	ChevronDown,
	Plus,
	Trash2,
	Edit,
	MessageSquare,
	Grip,
	EyeOff,
	Lock,
	Unlock,
	Moon,
	Pencil,
	Save,
	Download,
	Upload,
} from 'lucide-react'
import { Slider } from '@/shared/components/ui/slider'
import { toast } from 'sonner'

interface FloatingTodoProps {
	inDevTools?: boolean
}

const FloatingTodo: React.FC<FloatingTodoProps> = ({ inDevTools = false }) => {
	const {
		todos,
		position,
		size,
		isCollapsed,
		isVisible,
		isLocked,
		opacity,
		title,
		addTodo,
		updateTodo,
		deleteTodo,
		toggleTodoCompletion,
		setPosition,
		setSize,
		toggleCollapse,
		toggleVisibility,
		toggleLock,
		setOpacity,
		setTitle,
		exportToJson,
		importFromJson,
	} = useTodoStore()

	// Local states
	const [newTodoTitle, setNewTodoTitle] = useState('')
	const [editingTodoId, setEditingTodoId] = useState<string | null>(null)
	const [editingTitle, setEditingTitle] = useState('')
	const [editingRichContent, setEditingRichContent] = useState('')
	const [showNotes, setShowNotes] = useState<string | null>(null)
	const [isDragging, setIsDragging] = useState(false)
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
	const [isResizing, setIsResizing] = useState(false)
	const [resizeDirection, setResizeDirection] = useState<string | null>(null)
	const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 })
	const [resizeStartSize, setResizeStartSize] = useState({
		width: 0,
		height: 0,
	})
	const [showSettings, setShowSettings] = useState(false)
	const [editingPanelTitle, setEditingPanelTitle] = useState(false)
	const [tempTitle, setTempTitle] = useState(title)
	const [animateIn, setAnimateIn] = useState(false)

	// Refs
	const containerRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)
	const editInputRef = useRef<HTMLInputElement>(null)
	const titleInputRef = useRef<HTMLInputElement>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (editingTodoId && editInputRef.current) {
			editInputRef.current.focus()
		}
	}, [editingTodoId])

	useEffect(() => {
		if (editingPanelTitle && titleInputRef.current) {
			titleInputRef.current.focus()
			titleInputRef.current.select()
		}
	}, [editingPanelTitle])

	// Add animation in effect
	useEffect(() => {
		setAnimateIn(true)
	}, [])

	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!containerRef.current || isLocked) return

		setIsDragging(true)

		const rect = containerRef.current.getBoundingClientRect()
		setDragOffset({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		})
	}

	const startResizing = (direction: string) => (e: React.MouseEvent) => {
		if (isLocked) return
		e.stopPropagation()

		setIsResizing(true)
		setResizeDirection(direction)
		setResizeStartPos({ x: e.clientX, y: e.clientY })
		setResizeStartSize({ width: size.width, height: size.height })
	}

	const handleMouseMove = (e: MouseEvent) => {
		if (isDragging) {
			// Handle dragging
			const newX = e.clientX - dragOffset.x
			const newY = e.clientY - dragOffset.y

			setPosition({ x: newX, y: newY })
		} else if (isResizing && resizeDirection) {
			// Handle resizing
			const deltaX = e.clientX - resizeStartPos.x
			const deltaY = e.clientY - resizeStartPos.y

			let newWidth = resizeStartSize.width
			let newHeight = resizeStartSize.height

			// Update width based on horizontal resize directions
			if (resizeDirection.includes('e')) {
				newWidth = Math.max(220, resizeStartSize.width + deltaX)
			} else if (resizeDirection.includes('w')) {
				newWidth = Math.max(220, resizeStartSize.width - deltaX)
				if (newWidth !== resizeStartSize.width) {
					setPosition({
						x: position.x + (resizeStartSize.width - newWidth),
						y: position.y,
					})
				}
			}

			// Update height based on vertical resize directions
			if (resizeDirection.includes('s')) {
				newHeight = Math.max(200, resizeStartSize.height + deltaY)
			} else if (resizeDirection.includes('n')) {
				newHeight = Math.max(200, resizeStartSize.height - deltaY)
				if (newHeight !== resizeStartSize.height) {
					setPosition({
						x: position.x,
						y: position.y + (resizeStartSize.height - newHeight),
					})
				}
			}

			setSize({ width: newWidth, height: newHeight })
		}
	}

	const handleMouseUp = () => {
		setIsDragging(false)
		setIsResizing(false)
		setResizeDirection(null)
	}

	useEffect(() => {
		if (isDragging || isResizing) {
			document.addEventListener('mousemove', handleMouseMove)
			document.addEventListener('mouseup', handleMouseUp)
		}

		return () => {
			document.removeEventListener('mousemove', handleMouseMove)
			document.removeEventListener('mouseup', handleMouseUp)
		}
	}, [isDragging, isResizing])

	const handleAddTodo = (e: React.FormEvent) => {
		e.preventDefault()
		if (!newTodoTitle.trim()) return

		addTodo(newTodoTitle)
		setNewTodoTitle('')
		setTimeout(() => inputRef.current?.focus(), 10)

		// Bounce animation on add
		if (containerRef.current) {
			containerRef.current.classList.add('animate-bounce')
			setTimeout(() => {
				containerRef.current?.classList.remove('animate-bounce')
			}, 500)
		}
	}

	const startEditingTitle = () => {
		setEditingPanelTitle(true)
		setTempTitle(title)
	}

	const saveTitle = () => {
		if (tempTitle.trim()) {
			setTitle(tempTitle)
			toast({
				title: 'Title Updated',
				description: 'Your todo list title has been updated.',
			})
		} else {
			setTempTitle(title)
		}
		setEditingPanelTitle(false)
	}

	const handleTitleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			saveTitle()
		} else if (e.key === 'Escape') {
			setEditingPanelTitle(false)
			setTempTitle(title)
		}
	}

	const startEditing = (id: string, title: string, richContent?: string) => {
		setEditingTodoId(id)
		setEditingTitle(title)
		setEditingRichContent(richContent || '<p></p>')
	}

	const saveEdit = () => {
		if (editingTodoId) {
			updateTodo(editingTodoId, {
				title: editingTitle,
				richContent: editingRichContent,
			})
			setEditingTodoId(null)

			toast({
				title: 'Todo Updated',
				description: 'Your todo item has been updated successfully.',
			})
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			saveEdit()
		}
	}

	const toggleNotes = (id: string) => {
		setShowNotes(showNotes === id ? null : id)
	}

	// New methods for import/export
	const handleExport = () => {
		exportToJson()
		toast({
			title: 'Export Successful',
			description: 'Your todo list has been exported to a JSON file.',
		})
	}

	const triggerFileInput = () => {
		fileInputRef.current?.click()
	}

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		try {
			await importFromJson(file)
			toast({
				title: 'Import Successful',
				description: 'Your todo list has been imported from the JSON file.',
			})
		} catch (error) {
			toast({
				title: 'Import Failed',
				description: error instanceof Error ? error.message : 'Failed to import data',
				variant: 'destructive',
			})
		} finally {
			// Reset the file input so the same file can be selected again
			if (fileInputRef.current) {
				fileInputRef.current.value = ''
			}
		}
	}

	// Add conditional styling based on inDevTools prop
	const containerStyle: React.CSSProperties = inDevTools
		? {
				position: 'relative',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				opacity: 1,
			}
		: {
				position: 'fixed',
				top: `${position.y}px`,
				left: `${position.x}px`,
				width: `${size.width}px`,
				height: `${size.height}px`,
				opacity: isVisible ? opacity : 0,
				pointerEvents: isVisible ? 'auto' : ('none' as 'auto' | 'none'),
			}

	// Return early with simpler UI if not visible and not in dev tools
	if (!isVisible && !inDevTools) {
		return null
	}

	// ... handle toast notifications properly
	const showToast = (title: string, description: string, type: 'success' | 'error' = 'success') => {
		toast({
			title,
			description,
		})
	}

	return (
		<div
			ref={containerRef}
			className={`floating-note bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-lg flex flex-col overflow-hidden transition-all duration-200 ${
				animateIn ? 'animate-in fade-in-50 zoom-in-95' : ''
			} ${isDragging ? 'cursor-grabbing' : ''}`}
			style={containerStyle}
		>
			{/* Only render resize handles if not in dev tools */}
			{!inDevTools && (
				<>
					{/* Resize handles */}
					<div
						className="absolute top-0 right-0 left-0 h-1 cursor-ns-resize z-50"
						onMouseDown={startResizing('n')}
					></div>
					<div
						className="absolute top-0 bottom-0 right-0 w-1 cursor-ew-resize z-50"
						onMouseDown={startResizing('e')}
					></div>
					<div
						className="absolute bottom-0 right-0 left-0 h-1 cursor-ns-resize z-50"
						onMouseDown={startResizing('s')}
					></div>
					<div
						className="absolute top-0 bottom-0 left-0 w-1 cursor-ew-resize z-50"
						onMouseDown={startResizing('w')}
					></div>
					<div
						className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize z-50"
						onMouseDown={startResizing('ne')}
					></div>
					<div
						className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize z-50"
						onMouseDown={startResizing('se')}
					></div>
					<div
						className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize z-50"
						onMouseDown={startResizing('sw')}
					></div>
					<div
						className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize z-50"
						onMouseDown={startResizing('nw')}
					></div>
				</>
			)}

			{/* Header */}
			<div
				className={`flex items-center justify-between p-2 border-b border-gray-200 dark:border-zinc-800 ${
					!inDevTools ? 'cursor-grab' : ''
				}`}
				onMouseDown={!inDevTools ? handleMouseDown : undefined}
			>
				<div className="flex items-center gap-2 todo-handle">
					<Grip
						size={14}
						className="text-gray-400 animate-pulse"
					/>

					{editingPanelTitle ? (
						<div className="flex items-center animate-fade-in">
							<input
								ref={titleInputRef}
								type="text"
								value={tempTitle}
								onChange={(e) => setTempTitle(e.target.value)}
								onKeyDown={handleTitleKeyDown}
								onBlur={saveTitle}
								className="neo-input py-0.5 px-2 text-sm text-white outline-none w-40"
								autoComplete="off"
							/>
							<button
								onClick={saveTitle}
								className="p-1 ml-1 text-gray-400 hover:text-white transition-colors btn-hover"
							>
								<Save
									size={14}
									className="header-icon"
								/>
							</button>
						</div>
					) : (
						<div className="flex items-center">
							<h3 className="font-medium text-sm">{title}</h3>
							<button
								onClick={startEditingTitle}
								className="p-1 ml-1 text-gray-400 hover:text-white transition-colors"
								title="Edit title"
							>
								<Pencil
									size={12}
									className="header-icon"
								/>
							</button>
						</div>
					)}
				</div>

				<div className="flex items-center gap-1">
					{/* Export/Import buttons */}
					<button
						onClick={handleExport}
						className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors header-icon"
						title="Export to JSON"
						style={{ pointerEvents: 'auto' }}
					>
						<Download
							size={14}
							className="header-icon"
						/>
					</button>
					<button
						onClick={triggerFileInput}
						className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
						title="Import from JSON"
						style={{ pointerEvents: 'auto' }}
					>
						<Upload
							size={14}
							className="header-icon"
						/>
					</button>

					<button
						onClick={() => setShowSettings(!showSettings)}
						className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
						style={{ pointerEvents: 'auto' }}
					>
						<Moon
							size={14}
							className={`header-icon ${showSettings ? 'text-blue-400' : ''}`}
						/>
					</button>
					<button
						onClick={toggleLock}
						className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
						style={{ pointerEvents: 'auto' }}
					>
						{isLocked ? (
							<Lock
								size={14}
								className="header-icon text-yellow-500 animate-pulse"
							/>
						) : (
							<Unlock
								size={14}
								className="header-icon"
							/>
						)}
					</button>
					<button
						onClick={toggleVisibility}
						className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
						style={{ pointerEvents: 'auto' }}
					>
						<EyeOff
							size={14}
							className="header-icon"
						/>
					</button>
					<button
						onClick={toggleCollapse}
						className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
						style={{ pointerEvents: 'auto' }}
					>
						{isCollapsed ? (
							<ChevronDown
								size={14}
								className="animate-bounce"
							/>
						) : (
							<ChevronUp
								size={14}
								className="header-icon"
							/>
						)}
					</button>
				</div>
			</div>

			{showSettings && !isCollapsed && (
				<div className="bg-black bg-opacity-95 border-x border-b border-gray-800 p-3 settings-panel">
					<h4 className="text-xs font-medium text-gray-400 mb-2 animate-fade-in">Settings</h4>
					<div className="space-y-3 animate-slide-right">
						<div>
							<label className="text-xs text-gray-400 mb-1 block">Opacity</label>
							<div className="flex items-center gap-2">
								<Slider
									value={[opacity * 100]}
									min={20}
									max={100}
									step={5}
									onValueChange={(val) => setOpacity(val[0] / 100)}
									className="flex-grow"
								/>
								<span className="text-xs text-white">{Math.round(opacity * 100)}%</span>
							</div>
						</div>
					</div>
				</div>
			)}

			{!isCollapsed && (
				<div
					className={`bg-black bg-opacity-95 border-x border-b border-gray-800 rounded-b-lg overflow-hidden ${isCollapsed ? 'animate-contract' : 'animate-expand'}`}
					style={{
						height: showSettings ? `${size.height - 100}px` : `${size.height - 50}px`,
						maxHeight: '80vh',
					}}
				>
					{/* Add todo form */}
					<form
						onSubmit={handleAddTodo}
						className="p-3 border-b border-gray-800"
					>
						<div className="flex items-center gap-2">
							<input
								ref={inputRef}
								type="text"
								value={newTodoTitle}
								onChange={(e) => setNewTodoTitle(e.target.value)}
								placeholder="Add new todo..."
								className="neo-input w-full py-1.5 px-3 text-sm text-white placeholder:text-gray-500 outline-none"
								autoComplete="off"
							/>
							<button
								type="submit"
								disabled={!newTodoTitle.trim()}
								className={`flex-shrink-0 p-1.5 rounded-md btn-hover ${
									newTodoTitle.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 text-gray-500'
								} transition-colors`}
							>
								<Plus
									size={16}
									className="btn-icon"
								/>
							</button>
						</div>
					</form>

					{/* Todo list */}
					<div
						className="overflow-y-auto scrollbar-none"
						style={{ height: 'calc(100% - 54px)' }}
					>
						{todos.length === 0 ? (
							<div className="p-4 text-center text-gray-500 text-sm animate-fade-in">
								No todos yet. Add one above.
							</div>
						) : (
							<ul>
								{todos.map((todo, index) => (
									<li
										key={todo.id}
										className={`border-b border-gray-800 last:border-b-0 p-2 todo-item ${
											todo.completed ? 'bg-gray-900' : ''
										}`}
										style={{
											animationDelay: `${index * 0.05}s`,
										}}
									>
										{editingTodoId === todo.id ? (
											<div className="space-y-2 p-1 animate-fade-in">
												<input
													ref={editInputRef}
													type="text"
													value={editingTitle}
													onChange={(e) => setEditingTitle(e.target.value)}
													onKeyDown={handleKeyDown}
													className="neo-input w-full py-1.5 px-3 text-sm text-white outline-none"
												/>

												<RichTextEditor
													content={editingRichContent}
													onChange={setEditingRichContent}
													placeholder="Add notes (optional)"
												/>

												<div className="flex justify-end gap-2 pt-1">
													<button
														onClick={() => setEditingTodoId(null)}
														className="px-2 py-1 text-xs rounded bg-gray-800 text-gray-400 hover:text-white transition-colors btn-hover"
													>
														Cancel
													</button>
													<button
														onClick={saveEdit}
														className="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 btn-hover"
													>
														Save
													</button>
												</div>
											</div>
										) : (
											<div className="flex items-start gap-2 todo-item-enter">
												<button
													onClick={() => toggleTodoCompletion(todo.id)}
													className="mt-0.5 flex-shrink-0 text-blue-500 hover:text-blue-400 transition-colors btn-hover"
												>
													{todo.completed ? (
														<CheckCircle
															size={16}
															className="animate-scale-in"
														/>
													) : (
														<Circle size={16} />
													)}
												</button>

												<div className="flex-grow min-w-0">
													<div className="flex items-start justify-between gap-2">
														<span
															className={`text-sm line-clamp-2 ${
																todo.completed
																	? 'text-gray-500 line-through'
																	: 'text-white'
															}`}
														>
															{todo.title}
														</span>

														<div className="flex items-center gap-1 mt-0.5 flex-shrink-0">
															{todo.richContent && todo.richContent !== '<p></p>' && (
																<button
																	onClick={() => toggleNotes(todo.id)}
																	className={`p-1 rounded action-icon ${
																		showNotes === todo.id
																			? 'text-blue-500 bg-gray-800'
																			: 'text-gray-400 hover:text-white hover:bg-gray-800'
																	} transition-colors`}
																>
																	<MessageSquare
																		size={14}
																		className="btn-icon"
																	/>
																</button>
															)}
															<button
																onClick={() =>
																	startEditing(todo.id, todo.title, todo.richContent)
																}
																className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-colors action-icon"
															>
																<Edit
																	size={14}
																	className="btn-icon"
																/>
															</button>
															<button
																onClick={() => deleteTodo(todo.id)}
																className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-gray-800 transition-colors action-icon"
															>
																<Trash2
																	size={14}
																	className="btn-icon"
																/>
															</button>
														</div>
													</div>

													{showNotes === todo.id &&
														todo.richContent &&
														todo.richContent !== '<p></p>' && (
															<div className="mt-2 px-3 py-2.5 text-gray-300 bg-gray-800/90 border border-gray-700 rounded-md animate-fade-in rich-content">
																<div
																	className="prose prose-sm prose-invert max-w-none"
																	dangerouslySetInnerHTML={{
																		__html: todo.richContent,
																	}}
																/>
															</div>
														)}
												</div>
											</div>
										)}
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			)}
		</div>
	)
}

export default FloatingTodo
