'use client'

import { useState } from 'react'
import { Copy, ChevronRight, MoreHorizontal, Pencil, Trash } from 'lucide-react'
import { cn } from '@/shared/utils/helpers'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'

interface JSONViewerProps {
	data: string
	className?: string
	collapsible?: boolean
	defaultExpanded?: boolean
	onEdit?: () => void
	onDelete?: () => void
	isMultiple?: boolean
	onViewAll?: () => void
}

export function JSONViewer({
	data,
	className,
	collapsible = true,
	defaultExpanded = true,
	onEdit,
	onDelete,
	isMultiple = false,
	onViewAll,
}: JSONViewerProps) {
	const [isCopied, setIsCopied] = useState(false)
	const [isExpanded, setIsExpanded] = useState(defaultExpanded)

	// Try to parse the JSON data if it's a string
	let formattedData = data
	let parsedData: any
	let isValid = true

	try {
		if (typeof data === 'string') {
			parsedData = JSON.parse(data)
			formattedData = JSON.stringify(parsedData, null, 2)
		}
	} catch (error) {
		isValid = false
		formattedData = data // Keep original if can't parse
	}

	const handleCopy = () => {
		navigator.clipboard.writeText(formattedData)
		setIsCopied(true)
		setTimeout(() => setIsCopied(false), 2000)
	}

	const toggleExpand = () => {
		setIsExpanded(!isExpanded)
	}

	// Simple syntax highlighting functions
	const highlightJSON = (json: string) => {
		if (!isValid) return <span className="text-red-500">{json}</span>

		// Replace JSON syntax with highlighted spans
		return json.split('\n').map((line, i) => (
			<div
				key={i}
				className="code-line"
			>
				{highlightLine(line)}
			</div>
		))
	}

	const highlightLine = (line: string) => {
		// Basic regex patterns for JSON syntax
		const patterns = [
			// String values (including keys)
			{
				pattern: /(".*?")(: )?/g,
				className: 'text-orange-400 dark:text-orange-300',
			},
			// Numbers
			{
				pattern: /\b(\d+\.?\d*)\b/g,
				className: 'text-purple-500 dark:text-purple-300',
			},
			// Boolean values
			{
				pattern: /\b(true|false)\b/g,
				className: 'text-blue-500 dark:text-blue-300',
			},
			// Null values
			{
				pattern: /\b(null)\b/g,
				className: 'text-gray-500 dark:text-gray-400',
			},
			// Punctuation
			{
				pattern: /([{}\[\],])/g,
				className: 'text-gray-600 dark:text-gray-400',
			},
		]

		let result = [{ text: line, className: 'text-gray-800 dark:text-gray-200' }]

		// Apply each pattern
		patterns.forEach(({ pattern, className }) => {
			result = result.flatMap((segment) => {
				if (!segment.text) return segment

				const parts = []
				let lastIndex = 0
				let match

				const regex = new RegExp(pattern)
				while ((match = regex.exec(segment.text)) !== null) {
					// Text before the match
					if (match.index > lastIndex) {
						parts.push({
							text: segment.text.substring(lastIndex, match.index),
							className: segment.className,
						})
					}

					// The matched text
					parts.push({
						text: match[0],
						className,
					})

					lastIndex = match.index + match[0].length
				}

				// Text after the last match
				if (lastIndex < segment.text.length) {
					parts.push({
						text: segment.text.substring(lastIndex),
						className: segment.className,
					})
				}

				return parts.length ? parts : [segment]
			})
		})

		return result.map((segment, i) => (
			<span
				key={i}
				className={segment.className}
			>
				{segment.text}
			</span>
		))
	}

	return (
		<div className={cn('relative rounded-md', className)}>
			<div className="flex justify-between items-center mb-1 gap-2">
				{collapsible && (
					<Button
						variant="ghost"
						size="sm"
						onClick={toggleExpand}
						className="text-xs h-6 px-2 flex items-center justify-between gap-1"
					>
						<span className="flex items-center">
							<ChevronRight
								className={cn(
									'h-3.5 w-3.5 mr-1 transition-transform duration-200',
									isExpanded && 'rotate-90'
								)}
							/>
							{isExpanded ? 'Collapse' : 'Expand'}
						</span>
					</Button>
				)}

				<div className="flex items-center gap-1">
					{isMultiple && onViewAll && (
						<Button
							variant="outline"
							size="sm"
							onClick={onViewAll}
							className="h-6 text-xs px-2 border-gray-200 dark:border-zinc-800"
						>
							View All
						</Button>
					)}

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="h-6 w-6 p-0 rounded-full"
							>
								<MoreHorizontal className="h-3.5 w-3.5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							className="w-32"
						>
							<DropdownMenuItem
								onClick={handleCopy}
								className="text-xs"
							>
								<Copy className="h-3.5 w-3.5 mr-2" />
								{isCopied ? 'Copied!' : 'Copy'}
							</DropdownMenuItem>

							{onEdit && (
								<DropdownMenuItem
									onClick={onEdit}
									className="text-xs"
								>
									<Pencil className="h-3.5 w-3.5 mr-2" />
									Edit
								</DropdownMenuItem>
							)}

							{onDelete && (
								<DropdownMenuItem
									onClick={onDelete}
									className="text-xs text-red-500 focus:text-red-500"
								>
									<Trash className="h-3.5 w-3.5 mr-2" />
									Delete
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{isExpanded && (
				<pre
					className={cn(
						'bg-gray-50 dark:bg-zinc-900 p-3 rounded-md overflow-auto text-xs font-mono',
						'max-h-[400px] border border-gray-200 dark:border-zinc-800'
					)}
				>
					{highlightJSON(formattedData)}
				</pre>
			)}
		</div>
	)
}
