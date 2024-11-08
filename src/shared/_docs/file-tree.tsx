'use client'

import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/ui/code-block'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, File, Folder } from 'lucide-react'
import * as React from 'react'

/**
 * Type definitions for the file tree component
 */
type TreeNodeType = 'file' | 'folder'

type FileExtension =
	| 'ts'
	| 'tsx'
	| 'js'
	| 'jsx'
	| 'json'
	| 'md'
	| 'css'
	| 'scss'
	| 'server.tsx'
	| 'server.ts'
	| 'z.ts'

type PreviewContent = {
	code: string
	language: string
	title?: string
}

type GitHubLink = {
	url: string
	branch?: string
	path?: string
}

interface BaseNode {
	type: TreeNodeType
	name: string
	highlighted?: boolean
	githubLink?: GitHubLink
}

interface FileNode extends BaseNode {
	type: 'file'
	extension: FileExtension
	preview?: PreviewContent
}

interface FolderNode extends BaseNode {
	type: 'folder'
	children: TreeNode[]
	defaultOpen?: boolean
}

type TreeNode = FileNode | FolderNode

/**
 * Props for the FileTree component
 */
interface FileTreeProps {
	/**
	 * Tree structure data
	 */
	data: TreeNode[]

	/**
	 * Close all folders by default if set to false
	 * @default true
	 */
	defaultOpen?: boolean

	/**
	 * Custom class name for the root element
	 */
	className?: string

	/**
	 * Preview component type - uses shadcn/ui components
	 * @default "popover"
	 */
	previewType?: 'popover' | 'dialog'

	/**
	 * Enable/disable animations
	 * @default true
	 */
	animate?: boolean

	/**
	 * Icon set configuration
	 */
	icons?: Record<FileExtension, React.ComponentType<{ className?: string }>>
}

/**
 * Motion variants for animations
 */
const expandVariants = {
	open: {
		height: 'auto',
		opacity: 1,
		transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
	},
	closed: {
		height: 0,
		opacity: 0,
		transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
	}
}

const chevronVariants = {
	open: { rotate: 90 },
	closed: { rotate: 0 },
	transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
}

/**
 * FileTree component
 */
export function FileTree({
	data,
	defaultOpen = true,
	className,
	previewType = 'popover',
	animate = true,
	icons
}: FileTreeProps) {
	return (
		<ScrollArea className={className}>
			<div className="p-2">
				{data.map((node, index) => (
					<TreeNode
						key={`${node.name}-${index}`}
						node={node}
						level={0}
						defaultOpen={defaultOpen}
						previewType={previewType}
						animate={animate}
						icons={icons}
					/>
				))}
			</div>
		</ScrollArea>
	)
}

/**
 * TreeNode component for rendering individual nodes
 */
function TreeNode({
	node,
	level,
	defaultOpen,
	previewType,
	animate,
	icons
}: {
	node: TreeNode
	level: number
	defaultOpen: boolean
	previewType: 'popover' | 'dialog'
	animate: boolean
	icons?: Record<FileExtension, React.ComponentType<{ className?: string }>>
}) {
	const [isOpen, setIsOpen] = React.useState(
		node.type === 'folder' ? defaultOpen : false
	)

	const toggleOpen = () => {
		if (node.type === 'folder') {
			setIsOpen(!isOpen)
		}
	}

	const Icon = node.type === 'file' ? File : Folder
	const FileIcon = node.type === 'file' && icons?.[node.extension]

	return (
		<div>
			<div
				className={`flex items-center py-1 px-2 rounded-md hover:bg-accent cursor-pointer ${
					node.highlighted ? 'bg-accent' : ''
				}`}
				style={{ paddingLeft: `${level * 16 + 4}px` }}
				onClick={toggleOpen}
			>
				{node.type === 'folder' && (
					<motion.div
						variants={chevronVariants}
						initial={false}
						animate={isOpen ? 'open' : 'closed'}
					>
						<ChevronRight className="w-4 h-4 mr-1 text-muted-foreground" />
					</motion.div>
				)}
				{FileIcon ? (
					<FileIcon className="w-4 h-4 mr-2 text-muted-foreground" />
				) : (
					<Icon className="w-4 h-4 mr-2 text-muted-foreground" />
				)}
				<span className="text-sm">{node.name}</span>
				{node.githubLink && (
					<a
						href={node.githubLink.url}
						target="_blank"
						rel="noopener noreferrer"
						className="ml-2 text-xs text-muted-foreground hover:text-foreground"
						onClick={(e) => e.stopPropagation()}
					>
						GitHub
					</a>
				)}
			</div>
			{node.type === 'folder' && (
				<AnimatePresence initial={false}>
					{isOpen && (
						<motion.div
							variants={expandVariants}
							initial="closed"
							animate="open"
							exit="closed"
						>
							{node.children.map((childNode, index) => (
								<TreeNode
									key={`${childNode.name}-${index}`}
									node={childNode}
									level={level + 1}
									defaultOpen={defaultOpen}
									previewType={previewType}
									animate={animate}
									icons={icons}
								/>
							))}
						</motion.div>
					)}
				</AnimatePresence>
			)}
			{node.type === 'file' &&
				node.preview &&
				(previewType === 'popover' ? (
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="ml-auto"
							>
								Preview
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-[800px] p-0">
							<CodeBlock
								code={node.preview.code}
								language={node.preview.language}
								fileName={node.preview.title || node.name}
							/>
						</PopoverContent>
					</Popover>
				) : (
					<Dialog>
						<DialogTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="ml-auto"
							>
								Preview
							</Button>
						</DialogTrigger>
						<DialogContent className="max-w-[800px] p-0">
							<CodeBlock
								code={node.preview.code}
								language={node.preview.language}
								fileName={node.preview.title || node.name}
							/>
						</DialogContent>
					</Dialog>
				))}
		</div>
	)
}
