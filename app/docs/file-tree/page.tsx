'use client'

import React, { useCallback, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Button } from '../../../components/ui/button'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Switch } from '../../../components/ui/switch'
import FileTree, {
	FileStructure
} from '../../../features/docs/components/file-tree'

export default function FileTreeAPIExamples(): React.ReactElement {
	const [showCustomStyles, setShowCustomStyles] = useState<boolean>(false)
	const [collapsedFolders, setCollapsedFolders] = useState<string[]>([
		'docs',
		'src/utils'
	])
	const [highlightedItems, setHighlightedItems] = useState<string[]>([
		'src/components/Button.tsx'
	])
	const [searchTerm, setSearchTerm] = useState<string>('')

	const exampleStructure: FileStructure = {
		src: {
			components: {
				'Button.tsx': null,
				'Input.tsx': null,
				'Card.tsx': null
			},
			utils: {
				'helpers.ts': null,
				'constants.ts': null
			},
			'App.tsx': null,
			'index.tsx': null
		},
		public: {
			images: {
				'logo.png': null,
				'banner.jpg': null
			},
			'index.html': null,
			'favicon.ico': null
		},
		docs: {
			'getting-started.md': null,
			'api-reference.md': null
		},
		'package.json': null,
		'tsconfig.json': null,
		'README.md': null
	}

	const toggleCollapse = useCallback((folder: string) => {
		setCollapsedFolders((prev) =>
			prev.includes(folder)
				? prev.filter((f) => f !== folder)
				: [...prev, folder]
		)
	}, [])

	const toggleHighlight = useCallback((item: string) => {
		setHighlightedItems((prev) =>
			prev.includes(item)
				? prev.filter((i) => i !== item)
				: [...prev, item]
		)
	}, [])

	const handleToggle = useCallback((path: string, isCollapsed: boolean) => {
		console.log(`${path} is now ${isCollapsed ? 'collapsed' : 'expanded'}`)
		toast('Folder Toggled')
	}, [])

	const handleSelect = useCallback(() => {
		toast('File Selected')
	}, [])

	const filterStructure = useCallback(
		(structure: FileStructure, term: string): FileStructure => {
			const filtered: FileStructure = {}
			for (const [key, value] of Object.entries(structure)) {
				if (key.toLowerCase().includes(term.toLowerCase())) {
					filtered[key] = value
				} else if (value !== null) {
					const subFiltered = filterStructure(value, term)
					if (Object.keys(subFiltered).length > 0) {
						filtered[key] = subFiltered
					}
				}
			}
			return filtered
		},
		[]
	)

	const filteredStructure = searchTerm
		? filterStructure(exampleStructure, searchTerm)
		: exampleStructure

	return (
		<div className="container mx-auto p-4 space-y-8">
			<h1 className="text-3xl font-bold mb-4">FileTree API Examples</h1>

			<Card>
				<CardHeader>
					<CardTitle>Interactive API Example</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="mb-4 space-y-2">
						<div>
							<Label htmlFor="custom-styles">Custom Styles</Label>
							<Switch
								id="custom-styles"
								checked={showCustomStyles}
								onCheckedChange={setShowCustomStyles}
							/>
						</div>
						<div>
							<Label htmlFor="search">Search Files</Label>
							<Input
								id="search"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder="Enter search term..."
							/>
						</div>
						<div>
							<Label>Toggle Collapsed Folders:</Label>
							<div className="flex flex-wrap gap-2 mt-1">
								{[
									'src',
									'src/components',
									'src/utils',
									'docs'
								].map((folder) => (
									<Button
										key={folder}
										variant="outline"
										size="sm"
										onClick={() => toggleCollapse(folder)}
									>
										{folder}
									</Button>
								))}
							</div>
						</div>
						<div>
							<Label>Toggle Highlighted Items:</Label>
							<div className="flex flex-wrap gap-2 mt-1">
								{[
									'src/App.tsx',
									'src/components/Button.tsx',
									'README.md'
								].map((item) => (
									<Button
										key={item}
										variant="outline"
										size="sm"
										onClick={() => toggleHighlight(item)}
									>
										{item}
									</Button>
								))}
							</div>
						</div>
					</div>
					<FileTree
						structure={filteredStructure}
						collapsed={collapsedFolders}
						highlighted={highlightedItems}
						className={
							showCustomStyles
								? 'bg-gray-100 p-4 rounded-lg shadow-inner'
								: ''
						}
						onToggle={handleToggle}
						onSelect={handleSelect}
					/>
				</CardContent>
			</Card>
		</div>
	)
}
