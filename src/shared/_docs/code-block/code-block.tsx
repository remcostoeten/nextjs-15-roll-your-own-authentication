'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
	ArrowDown,
	ArrowUp,
	Check,
	ChevronDown,
	Copy,
	File,
	Search,
	X
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { COPY_VARIANTS } from './animations'
import { Button } from './button'
import { cn } from './cn'

type Language = 'typescript' | 'python' | 'rust' | 'sql' | string

type CodeBlockProps = {
	code: string
	language: Language
	fileName?: string
	badges?: Array<{
		text: string
		variant?: BadgeVariant
	}>
	showLineNumbers?: boolean
	enableLineHighlight?: boolean
	showMetaInfo?: boolean
	maxHeight?: string
	className?: string
	onCopy?: (code: string) => void
	onLineClick?: (lineNumber: number) => void
	onSearch?: (query: string, results: number[]) => void
	badgeVariant?: BadgeVariant
	badgeColor?: string
	fileNameColor?: string
	initialSearchQuery?: string
	initialSearchResults?: number[]
	initialHighlightedLines?: number[]
	isDiff?: boolean
	diffLines?: Array<{
		content: string
		type: 'add' | 'remove' | 'context'
		lineNumber?: number
	}>
}

export default function CodeBlock({
	code,
	language,
	fileName,
	badges = [],
	enableLineHighlight = false,
	showMetaInfo = true,
	onCopy,
	onLineClick,
	onSearch,
	badgeVariant = 'default',
	badgeColor,
	fileNameColor,
	initialSearchQuery = '',
	initialSearchResults = [],
	initialHighlightedLines = [],
	isDiff = false,
	diffLines = [],
	showLineNumbers = true
}: CodeBlockProps) {
	const [isCollapsed, setIsCollapsed] = useState(false)
	const [isCopied, setIsCopied] = useState(false)
	const [isSearching, setIsSearching] = useState(!!initialSearchQuery)
	const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
	const [searchResults, setSearchResults] =
		useState<number[]>(initialSearchResults)
	const [currentResultIndex, setCurrentResultIndex] = useState(
		initialSearchResults.length > 0 ? 0 : -1
	)
	const [activeLines, setActiveLines] = useState<number[]>(
		initialHighlightedLines
	)
	const codeRef = useRef<HTMLDivElement>(null)
	const [isHovered, setIsHovered] = useState(false)

	const scrollToLine = useCallback((lineNumber: number) => {
		if (!codeRef.current) return

		const lineElement = codeRef.current.querySelector(
			`[data-line-number="${lineNumber}"]`
		)
		if (lineElement) {
			lineElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
		}
	}, [])

	const handleSearch = useCallback(
		(query: string) => {
			setSearchQuery(query)
			if (!query) {
				setSearchResults([])
				setCurrentResultIndex(-1)
				setActiveLines([])
				onSearch?.('', [])
				return
			}

			const lines = code.split('\n')
			const matches = lines.reduce((acc, line, index) => {
				if (line.toLowerCase().includes(query.toLowerCase())) {
					acc.push(index + 1)
				}
				return acc
			}, [] as number[])

			setSearchResults(matches)
			setCurrentResultIndex(matches.length > 0 ? 0 : -1)
			setActiveLines(matches)
			onSearch?.(query, matches)

			if (matches.length > 0) {
				scrollToLine(matches[0])
			}
		},
		[code, onSearch, scrollToLine]
	)

	useEffect(() => {
		handleSearch(searchQuery)
	}, [searchQuery, handleSearch])

	const copyToClipboard = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(code)
			setIsCopied(true)
			onCopy?.(code)
			setTimeout(() => setIsCopied(false), 2000)
		} catch (error) {
			console.error('Failed to copy:', error)
		}
	}, [code, onCopy])

	const goToNextResult = useCallback(() => {
		if (searchResults.length === 0) return
		const nextIndex = (currentResultIndex + 1) % searchResults.length
		setCurrentResultIndex(nextIndex)
		scrollToLine(searchResults[nextIndex])
	}, [searchResults, currentResultIndex, scrollToLine])

	const goToPreviousResult = useCallback(() => {
		if (searchResults.length === 0) return
		const prevIndex =
			currentResultIndex - 1 < 0
				? searchResults.length - 1
				: currentResultIndex - 1
		setCurrentResultIndex(prevIndex)
		scrollToLine(searchResults[prevIndex])
	}, [searchResults, currentResultIndex, scrollToLine])

	useEffect(() => {
		function handleKeyboard(e: KeyboardEvent) {
			if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
				copyToClipboard()
			}

			if ((e.metaKey || e.ctrlKey) && e.key === 'f' && !isCollapsed) {
				e.preventDefault()
				setIsSearching(true)
			}

			if (isSearching && searchResults.length > 0) {
				if (e.key === 'Enter') {
					if (e.shiftKey) {
						goToPreviousResult()
					} else {
						goToNextResult()
					}
				}
			}

			if (e.key === 'Escape') {
				setActiveLines([])
				setIsSearching(false)
				setSearchQuery('')
				setSearchResults([])
			}
		}

		window.addEventListener('keydown', handleKeyboard)
		return () => window.removeEventListener('keydown', handleKeyboard)
	}, [
		isCollapsed,
		isSearching,
		searchResults,
		currentResultIndex,
		copyToClipboard,
		goToNextResult,
		goToPreviousResult
	])

	const handleLineClick = useCallback(
		(lineNumber: number) => {
			if (!enableLineHighlight) return

			setActiveLines((prev) =>
				prev.includes(lineNumber)
					? prev.filter((line) => line !== lineNumber)
					: [...prev, lineNumber]
			)
			onLineClick?.(lineNumber)
		},
		[enableLineHighlight, onLineClick]
	)

	function renderSearchUI() {
		if (!isSearching) return null

		return (
			<div className="flex items-center gap-2 bg-[#111111] rounded-lg border border-[#333333] p-1 h-8">
				<div className="relative">
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search..."
						className="w-40 px-2 py-1 text-sm bg-transparent text-zinc-300 focus:outline-none placeholder:text-zinc-600"
						autoFocus
					/>
					{searchQuery && (
						<div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
							{searchResults.length > 0 ? (
								<span>
									{currentResultIndex + 1}/
									{searchResults.length}
								</span>
							) : (
								<span>No results</span>
							)}
						</div>
					)}
				</div>

				{searchResults.length > 0 && (
					<div className="flex items-center gap-1">
						<Button
							variant="ghost"
							size="icon"
							onClick={goToPreviousResult}
							className="h-6 w-6 text-zinc-500 hover:text-zinc-300"
						>
							<ArrowUp size={14} />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={goToNextResult}
							className="h-6 w-6 text-zinc-500 hover:text-zinc-300"
						>
							<ArrowDown size={14} />
						</Button>
					</div>
				)}

				<div className="h-4 w-[1px] bg-[#333333]" />
				<Button
					variant="ghost"
					size="icon"
					onClick={() => {
						setIsSearching(false)
						setSearchQuery('')
						setSearchResults([])
						setActiveLines([])
					}}
					className="h-6 w-6 text-zinc-500 hover:text-zinc-300"
				>
					<X size={14} />
				</Button>
			</div>
		)
	}

	const codeStats = {
		lines: code.split('\n').length,
		words: code.trim().split(/\s+/).length
	}

	function renderDiffContent() {
		return code.split('\n').map((line, index) => {
			let type: 'add' | 'remove' | 'context' = 'context'
			let lineClass = 'text-gray-300'
			let bgClass = ''
			let prefix = ' '

			if (line.startsWith('+')) {
				type = 'add'
				lineClass = 'text-green-400'
				bgClass = 'bg-green-500/10'
				prefix = '+'
			} else if (line.startsWith('-')) {
				type = 'remove'
				lineClass = 'text-red-400'
				bgClass = 'bg-red-500/10'
				prefix = '-'
			}

			return (
				<div
					key={index}
					className={cn(
						'flex hover:bg-white/5',
						bgClass,
						'transition-colors duration-100'
					)}
				>
					{showLineNumbers && (
						<div className="w-12 flex-shrink-0 text-gray-500 text-right pr-4 select-none">
							{type !== 'remove' && <span>{index + 1}</span>}
						</div>
					)}
					<div className={cn('flex-1 overflow-x-auto', lineClass)}>
						<pre className="font-mono">
							<code>
								<span className="select-none w-4 inline-block">
									{prefix}
								</span>
								{line.slice(1)}
							</code>
						</pre>
					</div>
				</div>
			)
		})
	}

	return (
		<div className="relative">
			<div
				className={cn(
					'group relative rounded-xl overflow-hidden bg-[#0A0A0A] border border-[#333333] w-full transition-all duration-200',
					isCollapsed && 'h-16'
				)}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<div className="flex justify-between items-center px-4 py-2.5 bg-[#0A0A0A] border-b border-[#333333]">
					<div className="flex items-center gap-3">
						<span className="text-zinc-500 transition-colors duration-200 group-hover:text-zinc-400">
							{getLanguageIcon(language)}
						</span>
						{fileName && (
							<div
								className={cn(
									'flex items-center gap-2 rounded-full px-3 py-1 border transition-all duration-200',
									fileNameColor
										? `border-${fileNameColor}-500/30 bg-${fileNameColor}-500/10 text-${fileNameColor}-400 group-hover:border-${fileNameColor}-400 group-hover:text-${fileNameColor}-300`
										: 'bg-[#111111] border-[#333333] group-hover:border-[#444444]'
								)}
							>
								<File
									size={12}
									className={
										fileNameColor
											? `text-${fileNameColor}-400`
											: 'text-zinc-400'
									}
								/>
								<span
									className={cn(
										'text-sm font-medium transition-colors duration-200',
										fileNameColor
											? `text-${fileNameColor}-400 group-hover:text-${fileNameColor}-300`
											: 'text-zinc-400 group-hover:text-zinc-300'
									)}
								>
									{fileName}
								</span>
							</div>
						)}
						<div className="flex items-center gap-2">
							{badges.map((badge, index) => (
								<span
									key={index}
									className={getBadgeClasses({
										variant: badge.variant || badgeVariant,
										customColor: badgeColor
									})}
								>
									{badge.text}
								</span>
							))}
							{showMetaInfo && (
								<span className="px-2 py-0.5 text-xs font-medium text-zinc-500">
									{codeStats.lines} lines • {codeStats.words}{' '}
									words
								</span>
							)}
						</div>
					</div>

					<div className="flex items-center space-x-1.5 h-8">
						{renderSearchUI()}

						{!isSearching && (
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setIsSearching(true)}
								className="relative h-8 w-8 text-zinc-500 hover:text-zinc-200 rounded-md transition-all duration-200 hover:bg-white/10"
								title="Search (⌘/Ctrl + F)"
							>
								<Search size={16} />
							</Button>
						)}

						<Button
							variant="ghost"
							size="icon"
							onClick={() => setIsCollapsed(!isCollapsed)}
							className="relative h-8 w-8 text-zinc-500 hover:text-zinc-200 rounded-md transition-all duration-200 hover:bg-white/10"
						>
							<motion.div
								initial={false}
								animate={{ rotate: isCollapsed ? 0 : 180 }}
								transition={{
									duration: 0.4,
									ease: [0.16, 1, 0.3, 1]
								}}
							>
								<ChevronDown size={16} />
							</motion.div>
						</Button>

						<Button
							variant="ghost"
							size="icon"
							onClick={copyToClipboard}
							className="relative h-8 w-8 text-zinc-500 hover:text-zinc-200 rounded-md transition-all duration-200 hover:bg-white/10"
							title="Copy code (⌘/Ctrl + C)"
						>
							<AnimatePresence mode="wait">
								{isCopied ? (
									<motion.div
										key="check"
										variants={COPY_VARIANTS}
										initial="initial"
										animate="animate"
										exit="exit"
										className="text-emerald-400"
									>
										<Check size={16} />
									</motion.div>
								) : (
									<Copy size={16} />
								)}
							</AnimatePresence>
						</Button>
					</div>
				</div>
			</div>
			<div
				className={cn(
					'code-content',
					isHovered && 'border-blue-500/30'
				)}
				ref={codeRef}
			>
				{isDiff
					? renderDiffContent()
					: code.split('\n').map((line, index) => (
							<div
								key={index}
								onMouseEnter={() => handleLineClick(index + 1)}
								className={cn(
									'code-line',
									activeLines.includes(index + 1) &&
										'bg-blue-500/10'
								)}
								data-line-number={index + 1}
							>
								{line}
							</div>
						))}
			</div>
		</div>
	)
}
