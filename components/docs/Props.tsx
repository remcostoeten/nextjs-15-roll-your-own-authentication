'use client'

import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { motion } from 'framer-motion'
import { ChevronDown, File, Folder } from 'lucide-react'
import { useState } from 'react'

// Importing types from FileTree
type FileStructure = {
	[key: string]: FileStructure | null
}

type AnimationLevel = 'none' | 'minimal' | 'full'

interface ThemeConfig {
	background: string
	text: string
	textMuted: string
	border: string
	hover: string
	selected: string
}

const darkTheme: ThemeConfig = {
	background: 'bg-zinc-900',
	text: 'text-zinc-100',
	textMuted: 'text-zinc-400',
	border: 'border-zinc-800',
	hover: 'hover:bg-zinc-800',
	selected: 'bg-zinc-800'
}

interface ApiParameterProps {
	name: string
	type: string
	required?: boolean
	description?: string
	allowedValues?: string[]
	properties?: FileStructure
	theme?: ThemeConfig
	animations?: AnimationLevel
}

function ApiParameter({
	name,
	type,
	required = false,
	description,
	allowedValues = [],
	properties = {},
	theme = darkTheme,
	animations = 'minimal'
}: ApiParameterProps) {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<div
			className={`w-full rounded-lg ${theme.background} border ${theme.border} space-y-4 p-4`}
		>
			<div className="flex flex-wrap items-center gap-2">
				<Badge
					variant="outline"
					className={`${theme.background} ${theme.text} ${theme.border} font-mono`}
				>
					{name}
				</Badge>
				<span className={theme.textMuted}>{type}</span>
				{required && (
					<Badge
						variant="destructive"
						className="bg-red-900/30 text-red-400 hover:bg-red-900/40"
					>
						Required
					</Badge>
				)}
			</div>

			{description && (
				<p className={`${theme.textMuted} text-sm`}>{description}</p>
			)}

			{allowedValues.length > 0 && (
				<>
					<div className="space-y-2">
						<h3 className={`text-sm font-medium ${theme.text}`}>
							Allowed Values
						</h3>
						<div className="flex flex-wrap gap-2">
							{allowedValues.map((value) => (
								<motion.div
									key={value}
									whileHover={{
										scale: animations !== 'none' ? 1.05 : 1
									}}
								>
									<Badge
										variant="outline"
										className={`${theme.background} ${theme.border} ${theme.text}`}
									>
										{value}
									</Badge>
								</motion.div>
							))}
						</div>
					</div>
					<Separator className={theme.border} />
				</>
			)}

			{Object.keys(properties).length > 0 && (
				<div className="space-y-2">
					<button
						onClick={() => setIsOpen(!isOpen)}
						className={`flex items-center gap-2 text-sm ${theme.text} ${theme.hover} w-full justify-between`}
					>
						<span className="font-mono">Properties of {name}</span>
						<motion.div
							animate={{ rotate: isOpen ? 180 : 0 }}
							transition={{
								duration: animations === 'none' ? 0 : 0.2
							}}
						>
							<ChevronDown className="w-4 h-4" />
						</motion.div>
					</button>

					{isOpen && (
						<div
							className={`pl-4 border-l ${theme.border} space-y-4 mt-2`}
						>
							{Object.entries(properties).map(
								([propName, propValue]) => (
									<ApiParameter
										key={propName}
										name={propName}
										type={
											typeof propValue === 'object' &&
											propValue !== null
												? 'object'
												: 'string'
										}
										properties={
											typeof propValue === 'object' &&
											propValue !== null
												? propValue
												: {}
										}
										theme={theme}
										animations={animations}
									/>
								)
							)}
						</div>
					)}
				</div>
			)}
		</div>
	)
}

interface ApiDocumentationProps {
	structure: FileStructure
	theme?: ThemeConfig
	animations?: AnimationLevel
}

export default function ApiDocumentation({
	structure,
	theme = darkTheme,
	animations = 'minimal'
}: ApiDocumentationProps) {
	const [selectedPath, setSelectedPath] = useState<string | null>(null)

	const renderFileTree = (struct: FileStructure, path: string = '') => {
		return Object.entries(struct || {}).map(([key, value]) => {
			const currentPath = path ? `${path}/${key}` : key
			const isFolder = value !== null

			return (
				<div key={currentPath} className="ml-4">
					<button
						onClick={() => setSelectedPath(currentPath)}
						className={`flex items-center gap-2 p-1 rounded ${theme.hover} ${selectedPath === currentPath ? theme.selected : ''}`}
					>
						{isFolder ? (
							<Folder className="w-4 h-4" />
						) : (
							<File className="w-4 h-4" />
						)}
						<span>{key}</span>
					</button>
					{isFolder && renderFileTree(value, currentPath)}
				</div>
			)
		})
	}

	const renderApiParameter = (path: string | null) => {
		if (!path) return null

		const pathParts = path.split('/')
		let current: FileStructure | null = structure

		for (const part of pathParts) {
			if (current && typeof current === 'object' && part in current) {
				current = current[part]
			} else {
				return null
			}
		}

		if (current === null) {
			// This is a leaf node (parameter)
			return (
				<ApiParameter
					name={pathParts[pathParts.length - 1]}
					type="string" // You might want to determine the actual type
					theme={theme}
					animations={animations}
				/>
			)
		} else {
			// This is a folder (object with properties)
			return (
				<ApiParameter
					name={pathParts[pathParts.length - 1]}
					type="object"
					properties={current}
					theme={theme}
					animations={animations}
				/>
			)
		}
	}

	return (
		<div className={`flex h-screen ${theme.background}`}>
			<div className={`w-1/4 p-4 border-r ${theme.border}`}>
				<h2 className={`text-xl font-semibold mb-4 ${theme.text}`}>
					API Structure
				</h2>
				<ScrollArea className="h-[calc(100vh-8rem)]">
					{renderFileTree(structure)}
				</ScrollArea>
			</div>
			<div className="w-3/4 p-4">
				<h1 className={`text-3xl font-bold mb-6 ${theme.text}`}>
					API Documentation
				</h1>
				<ScrollArea className="h-[calc(100vh-8rem)]">
					{renderApiParameter(selectedPath)}
				</ScrollArea>
			</div>
		</div>
	)
}
