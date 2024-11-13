import { motion } from 'framer-motion'
import { ListTree } from 'lucide-react'
import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
	type ReactNode
} from 'react'
import { IconType } from 'react-icons'
import * as Ri from 'react-icons/ri'
import * as Si from 'react-icons/si'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow, vs } from 'react-syntax-highlighter/dist/esm/styles/prism'

// Types & Interfaces
export type FileStructure = {
	[key: string]: FileStructure | null
}

export type IconPack = 'react-icons' | 'font-awesome' | 'ant-design'

export type ViewMode = 'tree' | 'list'

export type AnimationLevel = 'none' | 'minimal' | 'full'

export interface FileStats {
	size: number
	modified: string
	created: string
	type: string
	permissions?: string
}

export interface ContextMenuItem {
	label: string
	icon?: IconType
	action: (path: string) => void
	hotkey?: string
	disabled?: boolean
}

export interface FilePreview {
	type: 'image' | 'code' | 'text'
	content: string
	language?: string
	theme?: 'light' | 'dark'
}

export interface SearchOptions {
	fuzzy: boolean
	caseSensitive: boolean
	includeContent: boolean
	debounceMs: number
	minLength: number
}

export interface ThemeConfig {
	background: string
	text: string
	textMuted: string
	border: string
	accent: string
	accentHover: string
	hover: string
	selected: string
	highlighted: string
	error: string
	success: string
	warning: string
	indent: string
	shadow: string
	overlay: string
}

export const lightTheme: ThemeConfig = {
	background: 'bg-white',
	text: 'text-gray-900',
	textMuted: 'text-gray-500',
	border: 'border-gray-200',
	accent: 'bg-blue-500',
	accentHover: 'hover:bg-blue-600',
	hover: 'hover:bg-gray-100',
	selected: 'bg-blue-100',
	highlighted: 'bg-yellow-100',
	error: 'text-red-500',
	success: 'text-green-500',
	warning: 'text-yellow-500',
	indent: 'border-gray-200',
	shadow: 'shadow-md',
	overlay: 'bg-black/50'
}

export const darkTheme: ThemeConfig = {
	background: 'bg-gray-900',
	text: 'text-gray-100',
	textMuted: 'text-gray-400',
	border: 'border-gray-800',
	accent: 'bg-blue-600',
	accentHover: 'hover:bg-blue-700',
	hover: 'hover:bg-gray-800',
	selected: 'bg-gray-800',
	highlighted: 'bg-yellow-900/50',
	error: 'text-red-400',
	success: 'text-green-400',
	warning: 'text-yellow-400',
	indent: 'border-gray-800',
	shadow: 'shadow-md shadow-black/20',
	overlay: 'bg-black/70'
}

export interface FileTreeProps {
	// Core props
	structure: FileStructure
	collapsed?: string[]
	highlighted?: string[] | string
	className?: string

	// Event handlers
	onToggle?: (path: string, isCollapsed: boolean) => void
	onSelect?: (path: string) => void
	onMove?: (sourcePath: string, targetPath: string) => void
	onSelectionChange?: (selectedPaths: string[]) => void
	onFavoriteChange?: (path: string, isFavorite: boolean) => void
	onRename?: (oldPath: string, newPath: string) => void
	onDelete?: (paths: string[]) => void
	onCopy?: (sourcePaths: string[], targetPath: string) => void
	onCreateFile?: (path: string, type: 'file' | 'folder') => void

	// Customization
	iconPack?: IconPack
	renderCustomIcon?: (file: string) => ReactNode
	getFilePreview?: (path: string) => FilePreview | null
	getFileStats?: (path: string) => FileStats | null
	contextMenuItems?: ContextMenuItem[]

	// Features
	enableDragAndDrop?: boolean
	enableMultiSelect?: boolean
	enableFileStats?: boolean
	enableSearch?: boolean
	enableFavorites?: boolean
	enableRename?: boolean
	enableDelete?: boolean
	enableCopyPaste?: boolean
	enableCreateNew?: boolean
	enableShortcuts?: boolean
	enableBreadcrumbs?: boolean
	enableToolbar?: boolean
	enableVirtualization?: boolean

	// Appearance
	theme?: 'light' | 'dark' | ThemeConfig
	animations?: AnimationLevel
	viewMode?: ViewMode
	indentationWidth?: number
	showIndentationLines?: boolean
	rowHeight?: number

	// State
	searchTerm?: string
	searchOptions?: Partial<SearchOptions>
	loading?: string[]
	error?: string[]
	favorites?: string[]

	// Keyboard navigation
	expandOnKeyboardNav?: boolean
	shortcuts?: Record<string, () => void>
	enableFileIcons?: boolean
}

// Context
interface FileTreeContext {
	theme: ThemeConfig
	animations: AnimationLevel
	viewMode: ViewMode
	indentationWidth: number
	showIndentationLines: boolean
	enableFileStats: boolean
	enableSearch: boolean
	enableFavorites: boolean
	enableMultiSelect: boolean
	onSelect: (path: string) => void
	onToggle: (path: string, isCollapsed: boolean) => void
	onMove: (sourcePath: string, targetPath: string) => void
	favorites: Set<string>
	loading: Set<string>
	error: Set<string>
	onToggleCollapse: (path: string) => void
	collapsedPaths: Set<string>
	getFileStats: (path: string) => FileStats | null
}

const FileTreeContext = createContext<FileTreeContext | null>(null)

const useFileTree = () => {
	const context = useContext(FileTreeContext)
	if (!context) {
		throw new Error('useFileTree must be used within FileTreeProvider')
	}
	return context
}

// Constants
const DEFAULT_SEARCH_OPTIONS: SearchOptions = {
	fuzzy: true,
	caseSensitive: false,
	includeContent: false,
	debounceMs: 200,
	minLength: 2
}

const DEFAULT_ROW_HEIGHT = 28

// File extension icons mapping
const fileExtensionIcons: Record<string, IconType> = {
	// Programming Languages
	ts: Si.SiTypescript,
	tsx: Si.SiTypescript,
	js: Si.SiJavascript,
	jsx: Si.SiJavascript,
	py: Si.SiPython,
	rb: Si.SiRuby,
	php: Si.SiPhp,
	java: Si.SiJavascript,
	cpp: Si.SiCplusplus,
	c: Si.SiC,
	cs: Si.SiCsharp,
	go: Si.SiGo,
	rs: Si.SiRust,
	swift: Si.SiSwift,
	kt: Si.SiKotlin,

	// Web Technologies
	html: Si.SiHtml5,
	css: Si.SiCss3,
	scss: Si.SiSass,
	less: Si.SiLess,
	svg: Si.SiSvg,

	// Data & Config
	json: Si.SiJson,
	yaml: Si.SiYaml,
	yml: Si.SiYaml,
	xml: Si.SiXaml,
	csv: Ri.RiFileExcelLine,

	// Documentation
	md: Si.SiMarkdown,
	mdx: Si.SiMarkdown,
	pdf: Ri.RiFilePdfLine,
	doc: Ri.RiFileWordLine,
	docx: Ri.RiFileWordLine,

	// Images
	png: Ri.RiImageLine,
	jpg: Ri.RiImageLine,
	jpeg: Ri.RiImageLine,
	gif: Ri.RiImageLine,
	webp: Ri.RiImageLine,

	// Shell & Scripts
	sh: Si.SiGnubash,
	bash: Si.SiGnubash,
	zsh: Si.SiGnubash,
	fish: Si.SiGnubash,

	// Package Management
	'package.json': Si.SiNpm,
	'package-lock.json': Si.SiNpm,
	'yarn.lock': Si.SiYarn,

	// Docker
	dockerfile: Si.SiDocker,
	dockerignore: Si.SiDocker,

	// Git
	gitignore: Si.SiGit,

	// Environment
	env: Si.SiDotenv
}

// Utility Functions
const formatFileSize = (bytes: number): string => {
	const units = ['B', 'KB', 'MB', 'GB', 'TB']
	let size = bytes
	let unitIndex = 0

	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024
		unitIndex++
	}

	return `${size.toFixed(unitIndex > 0 ? 1 : 0)} ${units[unitIndex]}`
}

const formatDate = (date: string): string => {
	const d = new Date(date)
	const now = new Date()
	const diff = now.getTime() - d.getTime()
	const days = Math.floor(diff / (1000 * 60 * 60 * 24))

	if (days === 0) {
		return (
			'Today ' + d.toLocaleTimeString(undefined, { timeStyle: 'short' })
		)
	} else if (days === 1) {
		return (
			'Yesterday ' +
			d.toLocaleTimeString(undefined, { timeStyle: 'short' })
		)
	} else if (days < 7) {
		return d.toLocaleDateString(undefined, { weekday: 'long' })
	} else {
		return d.toLocaleDateString()
	}
}

// Custom Hooks
function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value)

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)

		return () => {
			clearTimeout(handler)
		}
	}, [value, delay])

	return debouncedValue
}

function useKeyboardNavigation(props: FileTreeProps) {
	const { structure, onSelect, onToggle, collapsed = [] } = props

	const [focusedPath, setFocusedPath] = useState<string>('')

	const allPaths = useMemo(() => getAllPaths(structure), [structure])

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (!focusedPath) return

			const currentIndex = allPaths.indexOf(focusedPath)

			switch (e.key) {
				case 'ArrowUp': {
					e.preventDefault()
					if (currentIndex > 0) {
						const nextPath = allPaths[currentIndex - 1]
						setFocusedPath(nextPath)
						onSelect?.(nextPath)
					}
					break
				}
				case 'ArrowDown': {
					e.preventDefault()
					if (currentIndex < allPaths.length - 1) {
						const nextPath = allPaths[currentIndex + 1]
						setFocusedPath(nextPath)
						onSelect?.(nextPath)
					}
					break
				}
				case 'ArrowRight': {
					e.preventDefault()
					if (collapsed.includes(focusedPath)) {
						onToggle?.(focusedPath, false)
					}
					break
				}
				case 'ArrowLeft': {
					e.preventDefault()
					if (!collapsed.includes(focusedPath)) {
						onToggle?.(focusedPath, true)
					} else {
						const parentPath = focusedPath
							.split('/')
							.slice(0, -1)
							.join('/')
						if (parentPath) {
							setFocusedPath(parentPath)
							onSelect?.(parentPath)
						}
					}
					break
				}
				case 'Enter': {
					e.preventDefault()
					onSelect?.(focusedPath)
					break
				}
			}
		},
		[focusedPath, allPaths, collapsed, onSelect, onToggle]
	)

	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [handleKeyDown])

	return { focusedPath, setFocusedPath }
}

function useFileOperations(props: FileTreeProps) {
	const [clipboard, setClipboard] = useState<{
		type: 'copy' | 'cut'
		paths: string[]
	} | null>(null)

	const [renamingPath, setRenamingPath] = useState<string | null>(null)

	const handleCopy = useCallback((paths: string[]) => {
		setClipboard({ type: 'copy', paths })
	}, [])

	const handleCut = useCallback((paths: string[]) => {
		setClipboard({ type: 'cut', paths })
	}, [])

	const handlePaste = useCallback(
		(targetPath: string) => {
			if (!clipboard) return

			const { type, paths } = clipboard
			if (type === 'copy') {
				props.onCopy?.(paths, targetPath)
			} else {
				paths.forEach((path) => {
					props.onMove?.(
						path,
						`${targetPath}/${path.split('/').pop()}`
					)
				})
			}

			if (type === 'cut') {
				setClipboard(null)
			}
		},
		[clipboard, props.onCopy, props.onMove]
	)

	const handleRename = useCallback(
		(oldPath: string, newName: string) => {
			const parentPath = oldPath.split('/').slice(0, -1).join('/')
			const newPath = parentPath ? `${parentPath}/${newName}` : newName
			props.onRename?.(oldPath, newPath)
			setRenamingPath(null)
		},
		[props.onRename]
	)

	return {
		clipboard,
		renamingPath,
		handleCopy,
		handleCut,
		handlePaste,
		handleRename,
		setRenamingPath
	}
}

function useSelection(props: FileTreeProps) {
	const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set())

	const toggleSelection = useCallback(
		(path: string) => {
			setSelectedPaths((prev) => {
				const next = new Set(prev)
				if (next.has(path)) {
					next.delete(path)
				} else if (props.enableMultiSelect) {
					next.add(path)
				} else {
					next.clear()
					next.add(path)
				}
				props.onSelectionChange?.(Array.from(next))
				return next
			})
		},
		[props.enableMultiSelect, props.onSelectionChange]
	)

	return { selectedPaths, toggleSelection }
}

type DragEventWithPath = React.DragEvent<HTMLDivElement> & {
	currentTarget: HTMLDivElement
}

// Main FileTree Component
export function FileTree({
	structure,
	collapsed = [],
	highlighted = [],
	className = '',
	iconPack = 'react-icons',
	theme = 'light',
	animations = 'minimal',
	viewMode = 'tree',
	indentationWidth = 20,
	showIndentationLines = true,
	enableFileStats = false,
	enableSearch = true,
	enableFavorites = false,
	enableMultiSelect = false,
	enableDragAndDrop = false,
	enableRename = false,
	enableDelete = false,
	enableCopyPaste = false,
	enableCreateNew = false,
	enableShortcuts = true,
	enableBreadcrumbs = true,
	enableToolbar = true,
	enableVirtualization = true,
	searchTerm = '',
	searchOptions = DEFAULT_SEARCH_OPTIONS,
	loading = [],
	error = [],
	favorites = [],
	rowHeight = DEFAULT_ROW_HEIGHT,
	enableFileIcons = false,
	...props
}: FileTreeProps): React.ReactElement {
	// Refs
	const rootRef = useRef<HTMLDivElement>(null)
	const virtualListRef = useRef<HTMLDivElement>(null)

	// Theme
	const themeConfig = useMemo(() => {
		if (typeof theme === 'object') return theme
		return theme === 'dark' ? darkTheme : lightTheme
	}, [theme])

	// State
	const [virtualSlice, setVirtualSlice] = useState({ start: 0, end: 50 })
	const [contextMenuState, setContextMenuState] = useState<{
		path: string
		position: { x: number; y: number }
	} | null>(null)
	const [isDragging, setIsDragging] = useState(false)
	const [collapsedPaths, setCollapsedPaths] = useState<Set<string>>(
		new Set(collapsed)
	)

	// Custom hooks
	const { focusedPath, setFocusedPath } = useKeyboardNavigation({
		structure,
		onSelect: props.onSelect,
		onToggle: props.onToggle,
		collapsed
	})

	const {
		clipboard,
		renamingPath,
		handleCopy,
		handleCut,
		handlePaste,
		handleRename,
		setRenamingPath
	} = useFileOperations({ ...props, structure })

	const { selectedPaths, toggleSelection } = useSelection({
		...props,
		structure
	})

	// Derived state
	const debouncedSearchTerm = useDebounce(
		searchTerm,
		searchOptions.debounceMs || 200
	)

	const filteredStructure = useMemo(() => {
		if (!debouncedSearchTerm) return structure
		return filterStructure(structure, debouncedSearchTerm, {
			...DEFAULT_SEARCH_OPTIONS,
			...searchOptions
		})
	}, [structure, debouncedSearchTerm, searchOptions])

	const allPaths = useMemo(
		() => getAllPaths(filteredStructure),
		[filteredStructure]
	)

	const visiblePaths = useMemo(() => {
		if (!enableVirtualization) return allPaths
		return allPaths.slice(virtualSlice.start, virtualSlice.end)
	}, [allPaths, enableVirtualization, virtualSlice])

	// Event Handlers
	const handleScroll = useCallback(() => {
		if (!enableVirtualization || !virtualListRef.current) return

		const { scrollTop, clientHeight } = virtualListRef.current
		const start = Math.floor(scrollTop / rowHeight)
		const end = start + Math.ceil(clientHeight / rowHeight)

		setVirtualSlice({ start, end: end + 10 }) // Add buffer
	}, [enableVirtualization, rowHeight])

	const handleContextMenu = useCallback(
		(e: React.MouseEvent, path: string) => {
			e.preventDefault()
			if (!props.contextMenuItems?.length) return

			setContextMenuState({
				path,
				position: { x: e.clientX, y: e.clientY }
			})
		},
		[props.contextMenuItems]
	)

	const closeContextMenu = useCallback(() => {
		setContextMenuState(null)
	}, [])

	const handleDragStart = useCallback(
		(e: DragEventWithPath, path: string) => {
			if (!enableDragAndDrop) return

			e.stopPropagation()
			e.dataTransfer.setData('text/plain', path)
			setIsDragging(true)

			// If the dragged item isn't selected, clear selection and select it
			if (!selectedPaths.has(path)) {
				toggleSelection(path)
			}
		},
		[enableDragAndDrop, selectedPaths, toggleSelection]
	)

	const handleDragEnd = useCallback(() => {
		setIsDragging(false)
	}, [])

	// Effects
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				rootRef.current &&
				!rootRef.current.contains(e.target as Node)
			) {
				closeContextMenu()
			}
		}

		document.addEventListener('click', handleClickOutside)
		return () => document.removeEventListener('click', handleClickOutside)
	}, [closeContextMenu])

	// Context value
	const handleToggleCollapse = useCallback(
		(path: string) => {
			setCollapsedPaths((prev) => {
				const next = new Set(prev)
				if (next.has(path)) {
					next.delete(path)
				} else {
					next.add(path)
				}
				return next
			})
			props.onToggle?.(path, !collapsedPaths.has(path))
		},
		[collapsedPaths, props.onToggle]
	)

	const contextValue = useMemo(
		() => ({
			theme: themeConfig,
			animations,
			viewMode,
			indentationWidth,
			showIndentationLines,
			enableFileStats,
			enableSearch,
			enableFavorites,
			enableMultiSelect,
			onSelect: props.onSelect || (() => {}),
			onToggle: props.onToggle || (() => {}),
			onMove: props.onMove || (() => {}),
			favorites: new Set(favorites),
			loading: new Set(loading),
			error: new Set(error),
			onToggleCollapse: handleToggleCollapse,
			collapsedPaths,
			getFileStats: props.getFileStats || (() => null)
		}),
		[
			themeConfig,
			animations,
			viewMode,
			indentationWidth,
			showIndentationLines,
			enableFileStats,
			enableSearch,
			enableFavorites,
			enableMultiSelect,
			props.onSelect,
			props.onToggle,
			props.onMove,
			favorites,
			loading,
			error,
			handleToggleCollapse,
			collapsedPaths,
			props.getFileStats
		]
	)

	return (
		<FileTreeContext.Provider value={contextValue}>
			<div
				ref={rootRef}
				className={`relative flex flex-col ${themeConfig.background} ${themeConfig.text} ${className}`}
				style={{ height: '100%' }}
			>
				{/* Toolbar */}
				{enableToolbar && (
					<FileTreeToolbar
						viewMode={viewMode}
						searchTerm={searchTerm}
						onCreateNew={
							enableCreateNew ? props.onCreateFile : undefined
						}
					/>
				)}

				{/* Breadcrumbs */}
				{enableBreadcrumbs && focusedPath && (
					<Breadcrumbs
						path={focusedPath}
						onNavigate={setFocusedPath}
					/>
				)}

				{/* Main tree/list content */}
				<div
					ref={virtualListRef}
					className="flex-1 overflow-auto"
					onScroll={handleScroll}
				>
					<div
						style={{
							height: enableVirtualization
								? allPaths.length * rowHeight
								: 'auto',
							paddingTop: enableVirtualization
								? virtualSlice.start * rowHeight
								: 0
						}}
					>
						{visiblePaths.map((path) => (
							<FileTreeNode
								key={path}
								path={path}
								structure={getPathStructure(
									filteredStructure,
									path
								)}
								level={path.split('/').length - 1}
								isCollapsed={collapsedPaths.has(path)}
								isHighlighted={highlighted.includes(path)}
								isSelected={selectedPaths.has(path)}
								isRenaming={renamingPath === path}
								iconPack={iconPacks[iconPack]}
								onContextMenu={handleContextMenu}
								// @ts-ignore
								onDragStart={handleDragStart}
								onDragEnd={handleDragEnd}
								onRename={handleRename}
							/>
						))}
					</div>
				</div>

				{/* Context Menu */}
				{contextMenuState && (
					<ContextMenu
						path={contextMenuState.path}
						position={contextMenuState.position}
						items={props.contextMenuItems || []}
						onClose={closeContextMenu}
					/>
				)}

				{/* Drag overlay */}
				{isDragging && (
					<div
						className={`fixed inset-0 ${themeConfig.overlay} pointer-events-none`}
					/>
				)}
			</div>
		</FileTreeContext.Provider>
	)
}

interface FileTreeNodeProps {
	path: string
	structure: FileStructure | null
	level: number
	isCollapsed: boolean
	isHighlighted: boolean
	isSelected: boolean
	isRenaming: boolean
	iconPack: { folder: IconType; folderOpen: IconType; file: IconType }
	onContextMenu: (e: React.MouseEvent, path: string) => void
	onDragStart: (e: React.DragEvent, path: string) => void
	onDragEnd: () => void
	onRename: (oldPath: string, newName: string) => void
	onFavoriteToggle?: (path: string) => void
}

function FileTreeNode({
	path,
	structure,
	level,
	isCollapsed,
	isHighlighted,
	isSelected,
	isRenaming,
	iconPack,
	onContextMenu,
	onDragStart,
	onDragEnd,
	onRename,
	onFavoriteToggle
}: FileTreeNodeProps) {
	const {
		theme,
		animations,
		indentationWidth,
		showIndentationLines,
		enableFileStats,
		enableFavorites,
		loading,
		error,
		favorites,
		onToggleCollapse,
		collapsedPaths,
		getFileStats
	} = useFileTree()

	const [isHovered, setIsHovered] = useState(false)
	const [isDragOver, setIsDragOver] = useState(false)
	const renameInputRef = useRef<HTMLInputElement>(null)

	const name = path.split('/').pop() || ''
	const isFolder = structure !== null
	const isLoading = loading.has(path)
	const isError = error.has(path)
	const isFavorite = favorites.has(path)

	// Get appropriate icon
	const Icon = useMemo(() => {
		if (isFolder) {
			return isCollapsed ? iconPack.folder : iconPack.folderOpen
		}
		const ext = name.split('.').pop()?.toLowerCase() || ''
		return fileExtensionIcons[ext] || iconPack.file
	}, [isFolder, isCollapsed, name, iconPack])

	// Get file stats if enabled
	const stats = useMemo(() => {
		if (!enableFileStats || !getFileStats) return null
		return getFileStats(path)
	}, [enableFileStats, getFileStats, path])

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		e.dataTransfer.dropEffect = 'move'
		setIsDragOver(true)
	}, [])

	const handleDragLeave = useCallback(() => {
		setIsDragOver(false)
	}, [])

	const handleRenameSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault()
			const newName = renameInputRef.current?.value.trim()
			if (newName && newName !== name) {
				onRename(path, newName)
			}
		},
		[path, name, onRename]
	)

	const handleRenameKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Escape') {
				onRename(path, name) // Cancel rename
			}
		},
		[path, name, onRename]
	)

	// Animation variants
	const variants = {
		initial: { opacity: 0, y: -10 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: 10 }
	}

	const handleFavoriteToggle = () => {
		onFavoriteToggle?.(path)
	}

	// Add function to count items by type
	const getTypeCounts = (
		struct: FileStructure | null
	): { files: number; folders: number } => {
		if (!struct) return { files: 0, folders: 0 }

		return Object.entries(struct).reduce(
			(acc, [_, value]) => {
				if (value === null) {
					acc.files++
				} else {
					acc.folders++
					const subCounts = getTypeCounts(value)
					acc.files += subCounts.files
					acc.folders += subCounts.folders
				}
				return acc
			},
			{ files: 0, folders: 0 }
		)
	}

	const typeCounts = useMemo(() => {
		return isFolder ? getTypeCounts(structure) : { files: 0, folders: 0 }
	}, [isFolder, structure])

	// Add click handler for folder collapse
	const handleToggleCollapse = (e: React.MouseEvent) => {
		e.stopPropagation()
		if (isFolder) {
			onToggleCollapse(path)
		}
	}

	return (
		<motion.div
			variants={variants}
			initial={animations === 'full' ? 'initial' : false}
			animate={animations === 'full' ? 'animate' : false}
			exit={animations === 'full' ? 'exit' : undefined}
			transition={{ duration: 0.2 }}
			className={`
        relative flex items-center group
        ${theme.hover}
        ${isHighlighted ? theme.highlighted : ''}
        ${isSelected ? theme.selected : ''}
        ${isDragOver ? theme.accent + ' bg-opacity-10' : ''}
        ${isError ? 'border-l-2 border-red-500' : ''}
      `}
			style={{ paddingLeft: level * indentationWidth }}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onContextMenu={(e: React.MouseEvent<Element, MouseEvent>) =>
				onContextMenu(e, path)
			}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			draggable
			// @ts-ignore
			onDragStart={(e: React.DragEvent<Element>) => onDragStart(e, path)}
			onDragEnd={onDragEnd}
		>
			{/* Indentation lines */}
			{showIndentationLines && level > 0 && (
				// @ts-ignore
				<div className="absolute left-0 top-0 bottom-0 flex">
					{Array.from({ length: level }).map((_, i) => (
						<div
							key={i}
							className={`border-l ${theme.indent}`}
							style={{ marginLeft: `${i * indentationWidth}px` }}
						/>
					))}
				</div>
			)}

			<div className="flex-1 flex items-center min-w-0 h-8 px-2">
				<button
					onClick={handleToggleCollapse}
					className={`flex-shrink-0 p-1 rounded hover:${theme.hover} ${isFolder ? 'cursor-pointer' : ''}`}
				>
					<Icon
						className={`w-5 h-5 ${isFolder ? theme.text : theme.textMuted}`}
					/>
				</button>

				{/* Name/Rename input */}
				{isRenaming ? (
					<form onSubmit={handleRenameSubmit} className="flex-1 ml-2">
						<input
							ref={renameInputRef}
							className={`w-full px-1 py-0.5 rounded ${theme.background} ${theme.text} border ${theme.border} focus:outline-none focus:ring-2`}
							defaultValue={name}
							autoFocus
							onKeyDown={handleRenameKeyDown}
							onBlur={handleRenameSubmit}
						/>
					</form>
				) : (
					<div className="flex items-center ml-2 space-x-2">
						<span className="truncate">{name}</span>
						{/* Add type count label for folders */}
						{isFolder && (
							<span className={`text-xs ${theme.textMuted}`}>
								{typeCounts.folders > 0 &&
									`${typeCounts.folders} folder${typeCounts.folders !== 1 ? 's' : ''}`}
								{typeCounts.folders > 0 &&
									typeCounts.files > 0 &&
									', '}
								{typeCounts.files > 0 &&
									`${typeCounts.files} file${typeCounts.files !== 1 ? 's' : ''}`}
							</span>
						)}
					</div>
				)}

				{/* File stats */}
				{enableFileStats && stats && isHovered && (
					<div className={`ml-2 text-sm ${theme.textMuted}`}>
						{formatFileSize(stats.size)} •{' '}
						{formatDate(stats.modified)}
					</div>
				)}

				{/* Action buttons */}
				<div
					className={`ml-auto flex items-center space-x-1 ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity`}
				>
					{enableFavorites && (
						<button
							className={`p-1 rounded hover:${theme.hover}`}
							onClick={handleFavoriteToggle}
						>
							{isFavorite ? (
								<Ri.RiStarFill className="w-4 h-4 text-yellow-400" />
							) : (
								<Ri.RiStarLine className="w-4 h-4" />
							)}
						</button>
					)}
				</div>

				{/* Loading spinner */}
				{isLoading && (
					<div className="ml-2">
						<motion.div
							animate={{ rotate: 360 }}
							transition={{
								duration: 1,
								repeat: Infinity,
								ease: 'linear'
							}}
						>
							<Ri.RiLoader4Line className="w-4 h-4" />
						</motion.div>
					</div>
				)}
			</div>

			{/* Error message */}
			{isError && (
				<div className={`ml-8 text-sm ${theme.error}`}>
					Error loading item
				</div>
			)}
		</motion.div>
	)
}
// ContextMenu Component
interface ContextMenuProps {
	path: string
	position: { x: number; y: number }
	items: ContextMenuItem[]
	onClose: () => void
}

function ContextMenu({ path, position, items, onClose }: ContextMenuProps) {
	const { theme } = useFileTree()
	const menuRef = useRef<HTMLDivElement>(null)
	const [adjustedPosition, setAdjustedPosition] = useState(position)

	useEffect(() => {
		if (menuRef.current) {
			const rect = menuRef.current.getBoundingClientRect()
			const { innerWidth, innerHeight } = window

			let { x, y } = position
			if (x + rect.width > innerWidth) {
				x = innerWidth - rect.width - 8
			}
			if (y + rect.height > innerHeight) {
				y = innerHeight - rect.height - 8
			}

			setAdjustedPosition({ x, y })
		}
	}, [position])

	return (
		<motion.div
			ref={menuRef}
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.95 }}
			transition={{ duration: 0.1 }}
			className={`
        fixed z-50 min-w-[160px] py-1
        rounded-lg shadow-lg
        ${theme.background}
        ${theme.border}
        border
      `}
			style={{
				left: adjustedPosition.x,
				top: adjustedPosition.y
			}}
		>
			{items.map((item, index) => (
				<button
					key={index}
					className={`
            w-full px-4 py-2 text-left flex items-center space-x-2
            ${theme.hover}
            ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
					onClick={() => {
						if (!item.disabled) {
							item.action(path)
							onClose()
						}
					}}
					disabled={item.disabled}
				>
					{item.icon && <item.icon className="w-4 h-4" />}
					<span className="flex-1">{item.label}</span>
					{item.hotkey && (
						<span className={`text-sm ${theme.textMuted}`}>
							{item.hotkey}
						</span>
					)}
				</button>
			))}
		</motion.div>
	)
}
interface FileTreeToolbarProps {
	viewMode: ViewMode
	searchTerm?: string
	onCreateNew?: (path: string, type: 'file' | 'folder') => void
}

function FileTreeToolbar({
	viewMode,
	searchTerm,
	onCreateNew
}: FileTreeToolbarProps) {
	const { theme } = useFileTree()
	const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false)

	const handleSearch = (value: string) => {
		// Implement search logic here
		console.log('Searching:', value)
	}

	return (
		<div
			className={`
      flex items-center space-x-2 p-2
      border-b ${theme.border}
    `}
		>
			{/* View mode toggle */}
			<div className="flex items-center rounded-lg border overflow-hidden">
				<button
					className={`
            p-2 ${viewMode === 'tree' ? theme.selected : theme.hover}
          `}
					title="Tree View"
				>
					<ListTree className="w-4 h-4" />
				</button>
				<button
					className={`
            p-2 ${viewMode === 'list' ? theme.selected : theme.hover}
          `}
					title="List View"
				>
					<Ri.RiListCheck className="w-4 h-4" />
				</button>
			</div>

			{/* Search */}
			<div className="flex-1 relative">
				<input
					type="text"
					placeholder="Search files..."
					value={searchTerm}
					onChange={(e) => handleSearch(e.target.value)}
					className={`
            w-full pl-8 pr-4 py-1.5 rounded-lg
            ${theme.background}
            ${theme.border}
            border
            focus:outline-none focus:ring-2
          `}
				/>
				<Ri.RiSearchLine
					className={`
          absolute left-2.5 top-1/2 transform -translate-y-1/2
          w-4 h-4 ${theme.textMuted}
        `}
				/>
			</div>

			{/* Create new button */}
			{onCreateNew && (
				<div className="relative">
					<button
						onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
						className={`
              p-2 rounded-lg ${theme.hover}
              flex items-center space-x-1
            `}
					>
						<Ri.RiAddLine className="w-4 h-4" />
						<span>New</span>
					</button>

					{isCreateMenuOpen && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							className={`
                absolute right-0 top-full mt-1
                w-48 py-1 rounded-lg shadow-lg
                ${theme.background}
                ${theme.border}
                border
              `}
						>
							<button
								className={`
                  w-full px-4 py-2 text-left flex items-center space-x-2
                  ${theme.hover}
                `}
								onClick={() => {
									onCreateNew('', 'file')
									setIsCreateMenuOpen(false)
								}}
							>
								<Ri.RiFileAddLine className="w-4 h-4" />
								<span>New File</span>
							</button>
							<button
								className={`
                  w-full px-4 py-2 text-left flex items-center space-x-2
                  ${theme.hover}
                `}
								onClick={() => {
									onCreateNew('', 'folder')
									setIsCreateMenuOpen(false)
								}}
							>
								<Ri.RiFolderAddLine className="w-4 h-4" />
								<span>New Folder</span>
							</button>
						</motion.div>
					)}
				</div>
			)}
		</div>
	)
}

// Breadcrumbs Component
interface BreadcrumbsProps {
	path: string
	onNavigate: (path: string) => void
}

function Breadcrumbs({ path, onNavigate }: BreadcrumbsProps) {
	const { theme } = useFileTree()
	const parts = path.split('/').filter(Boolean)

	return (
		<div
			className={`
      flex items-center space-x-1 px-2 py-1
      text-sm overflow-x-auto
      ${theme.textMuted}
    `}
		>
			<button
				onClick={() => onNavigate('')}
				className={`hover:${theme.text} whitespace-nowrap`}
			>
				root
			</button>
			{parts.map((part, index) => (
				<React.Fragment key={index}>
					<Ri.RiArrowRightSLine className="w-4 h-4 flex-shrink-0" />
					<button
						onClick={() =>
							onNavigate(parts.slice(0, index + 1).join('/'))
						}
						className={`hover:${theme.text} whitespace-nowrap`}
					>
						{part}
					</button>
				</React.Fragment>
			))}
		</div>
	)
}

// FilePreview Component
interface FilePreviewProps {
	preview: FilePreview
	position: { x: number; y: number }
	onClose: () => void
}

function FilePreview({ preview, position, onClose }: FilePreviewProps) {
	const { theme } = useFileTree()
	const previewRef = useRef<HTMLDivElement>(null)
	const [adjustedPosition, setAdjustedPosition] = useState(position)

	useEffect(() => {
		if (previewRef.current) {
			const rect = previewRef.current.getBoundingClientRect()
			const { innerWidth, innerHeight } = window

			let { x, y } = position
			const padding = 10

			// Adjust horizontal position
			if (x + rect.width > innerWidth - padding) {
				x = innerWidth - rect.width - padding
			}
			x = Math.max(padding, x)

			// Adjust vertical position
			if (y + rect.height > innerHeight - padding) {
				y = innerHeight - rect.height - padding
			}
			y = Math.max(padding, y)

			setAdjustedPosition({ x, y })
		}
	}, [position])

	return (
		<motion.div
			ref={previewRef}
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.95 }}
			className={`
        fixed z-40 rounded-lg shadow-xl
        ${theme.background}
        ${theme.border}
        border
        max-w-2xl
        max-h-[80vh]
        overflow-hidden
      `}
			style={{
				left: adjustedPosition.x,
				top: adjustedPosition.y
			}}
		>
			{/* Preview Header */}
			<div
				className={`
        flex items-center justify-between
        px-4 py-2 border-b ${theme.border}
      `}
			>
				<div className="flex items-center space-x-2">
					{preview.type === 'code' && (
						<div className={`text-sm ${theme.textMuted}`}>
							{preview.language || 'text'}
						</div>
					)}
				</div>
				<button
					onClick={onClose}
					className={`p-1 rounded-full hover:${theme.hover}`}
				>
					<Ri.RiCloseLine className="w-4 h-4" />
				</button>
			</div>

			{/* Preview Content */}
			<div className="p-4">
				{preview.type === 'image' && (
					<img
						src={preview.content}
						alt="Preview"
						className="max-w-full max-h-[60vh] object-contain"
					/>
				)}
				{preview.type === 'code' && (
					<SyntaxHighlighter
						language={preview.language || 'text'}
						style={
							theme.background === darkTheme.background
								? tomorrow
								: vs
						}
						className="max-h-[60vh] overflow-auto rounded"
						showLineNumbers
						customStyle={{ margin: 0, padding: '1rem' }}
					>
						{preview.content}
					</SyntaxHighlighter>
				)}
				{preview.type === 'text' && (
					<div className="max-h-[60vh] overflow-auto whitespace-pre-wrap">
						{preview.content}
					</div>
				)}
			</div>
		</motion.div>
	)
}

// DragOverlay Component
interface DragOverlayProps {
	count: number
}

function DragOverlay({ count }: DragOverlayProps) {
	const { theme } = useFileTree()

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className={`
        fixed bottom-4 right-4 z-50
        px-4 py-2 rounded-full shadow-lg
        ${theme.background}
        ${theme.border}
        border
      `}
		>
			<div className="flex items-center space-x-2">
				<Ri.RiDragMoveLine className="w-4 h-4" />
				<span>
					Moving {count} {count === 1 ? 'item' : 'items'}
				</span>
			</div>
		</motion.div>
	)
}

// ErrorBoundary Component
class FileTreeErrorBoundary extends React.Component<
	{ children: React.ReactNode },
	{ hasError: boolean }
> {
	constructor(props: { children: React.ReactNode }) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError() {
		return { hasError: true }
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error('FileTree Error:', error, errorInfo)
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="p-4 text-red-500">
					<h3 className="font-bold">Something went wrong</h3>
					<p>
						The file tree could not be rendered. Please try
						refreshing the page.
					</p>
				</div>
			)
		}

		return this.props.children
	}
}

// Utility Functions
function getFolderSize(structure: FileStructure): number {
	let size = 0
	for (const [, value] of Object.entries(structure)) {
		if (value === null) {
			size += 1 // Count files
		} else {
			size += getFolderSize(value) // Recursively count subfolder contents
		}
	}
	return size
}

function getPathStructure(
	structure: FileStructure,
	path: string
): FileStructure | null {
	if (!path) return structure
	const parts = path.split('/')
	let current: FileStructure | null = structure

	for (const part of parts) {
		if (!current || !current[part]) return null
		current = current[part]
	}

	return current
}

function getFileType(filename: string): string {
	const ext = filename.split('.').pop()?.toLowerCase() || ''
	const typeMap: Record<string, string> = {
		// Images
		png: 'image',
		jpg: 'image',
		jpeg: 'image',
		gif: 'image',
		svg: 'image',
		webp: 'image',
		// Documents
		pdf: 'document',
		doc: 'document',
		docx: 'document',
		txt: 'document',
		md: 'document',
		mdx: 'document',
		// Code
		ts: 'code',
		tsx: 'code',
		js: 'code',
		jsx: 'code',
		py: 'code',
		rb: 'code',
		go: 'code',
		rs: 'code',
		java: 'code',
		cpp: 'code',
		c: 'code',
		h: 'code',
		css: 'code',
		scss: 'code',
		html: 'code',
		// Data
		json: 'data',
		yaml: 'data',
		yml: 'data',
		xml: 'data',
		csv: 'data'
	}
	return typeMap[ext] || 'unknown'
}

function getAllPaths(
	structure: FileStructure,
	parentPath: string = ''
): string[] {
	const paths: string[] = []

	Object.entries(structure).forEach(([name, value]) => {
		const currentPath = parentPath ? `${parentPath}/${name}` : name
		paths.push(currentPath)

		if (value !== null) {
			paths.push(...getAllPaths(value, currentPath))
		}
	})

	return paths
}

// Add missing filterStructure function
function filterStructure(
	structure: FileStructure,
	searchTerm: string,
	options: SearchOptions
): FileStructure {
	const result: FileStructure = {}

	Object.entries(structure).forEach(([key, value]) => {
		if (key.toLowerCase().includes(searchTerm.toLowerCase())) {
			result[key] = value
		} else if (value !== null) {
			const filtered = filterStructure(value, searchTerm, options)
			if (Object.keys(filtered).length > 0) {
				result[key] = filtered
			}
		}
	})

	return result
}

// Add missing iconPacks definition
const iconPacks = {
	'react-icons': {
		folder: Ri.RiFolderLine,
		folderOpen: Ri.RiFolderOpenLine,
		file: Ri.RiFileTextLine
	},
	'font-awesome': {
		folder: Ri.RiFolderLine,
		folderOpen: Ri.RiFolderOpenLine,
		file: Ri.RiFileTextLine
	},
	'ant-design': {
		folder: Ri.RiFolderLine,
		folderOpen: Ri.RiFolderOpenLine,
		file: Ri.RiFileTextLine
	}
}

export {
	Breadcrumbs,
	ContextMenu,
	DragOverlay,
	FilePreview,
	FileTreeErrorBoundary,
	FileTreeNode,
	FileTreeToolbar,
	getFileType,
	getFolderSize,
	getPathStructure
}

export default FileTree
