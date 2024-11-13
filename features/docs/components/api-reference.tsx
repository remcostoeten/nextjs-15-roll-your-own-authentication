'use client'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import { CodeBlock } from './code-block/code-block'

interface PropDefinition {
	name: string
	type: string
	default?: string
	description: string
	required?: boolean
	version?: string
	examples?: string[]
	category: 'core' | 'styling' | 'behavior' | 'events' | 'advanced'
}

const PROPS: PropDefinition[] = [
	{
		name: 'structure',
		type: 'FileStructure',
		description: 'The file tree data structure to render',
		required: true,
		category: 'core',
		examples: [
			`
const structure = {
  'src': {
    'components': {
      'Button.tsx': null,
      'Input.tsx': null
    }
  },
  'package.json': null
}`
		]
	},
	{
		name: 'theme',
		type: "'light' | 'dark' | ThemeConfig",
		default: "'light'",
		description: 'The theme configuration for the file tree',
		category: 'styling',
		examples: [
			`
// Using preset theme
<FileTree theme="dark" />

// Using custom theme
<FileTree theme={{
  background: 'bg-gray-900',
  text: 'text-gray-100',
  hover: 'hover:bg-gray-800',
  selected: 'bg-blue-500/10',
  // ... more theme options
}} />`
		]
	},
	{
		name: 'enableFileIcons',
		type: 'boolean',
		default: 'false',
		description: 'Enable file type specific icons',
		category: 'behavior'
	},
	{
		name: 'onSelect',
		type: '(path: string) => void',
		description: 'Callback when a file is selected',
		category: 'events',
		examples: [
			`
const handleSelect = (path: string) => {
  console.log('Selected:', path)
}`
		]
	}
	// Add more props...
]

export function APIReference() {
	const [filter, setFilter] = useState('')
	const [category, setCategory] = useState<PropDefinition['category']>('core')

	const filteredProps = PROPS.filter(
		(prop) =>
			prop.category === category &&
			(filter === '' ||
				prop.name.toLowerCase().includes(filter.toLowerCase()) ||
				prop.description.toLowerCase().includes(filter.toLowerCase()))
	)

	return (
		<section className="space-y-8" id="api-reference">
			<div className="space-y-4">
				<h2 className="text-3xl font-bold">API Reference</h2>
				<p className="text-xl text-zinc-400">
					Comprehensive documentation of all available props and
					options
				</p>
			</div>

			<div className="flex items-center space-x-4 sticky top-0 bg-background py-4 z-10">
				<Input
					placeholder="Search props..."
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					className="max-w-xs"
				/>
				<Tabs
					value={category}
					onValueChange={(v) =>
						setCategory(v as PropDefinition['category'])
					}
				>
					<TabsList>
						<TabsTrigger value="core">Core</TabsTrigger>
						<TabsTrigger value="styling">Styling</TabsTrigger>
						<TabsTrigger value="behavior">Behavior</TabsTrigger>
						<TabsTrigger value="events">Events</TabsTrigger>
						<TabsTrigger value="advanced">Advanced</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			<div className="space-y-6">
				{filteredProps.map((prop) => (
					<Card key={prop.name} className="p-6 space-y-4">
						<div className="flex items-start justify-between">
							<div>
								<div className="flex items-center gap-2">
									<h3 className="text-lg font-mono font-medium text-blue-400">
										{prop.name}
									</h3>
									{prop.required && (
										<Badge variant="default">
											Required
										</Badge>
									)}
									{prop.version && (
										<Badge variant="secondary">
											v{prop.version}
										</Badge>
									)}
								</div>
								<p className="mt-1 text-zinc-400">
									{prop.description}
								</p>
							</div>
							<div className="text-right">
								<div className="font-mono text-sm text-zinc-500">
									{prop.type}
								</div>
								{prop.default && (
									<div className="text-sm text-zinc-500">
										Default: {prop.default}
									</div>
								)}
							</div>
						</div>

						{prop.examples && prop.examples.length > 0 && (
							<div className="space-y-2">
								<h4 className="text-sm font-medium">
									Examples
								</h4>
								{prop.examples.map((example, index) => (
									<CodeBlock
										key={index}
										language="tsx"
										code={example}
										className="text-sm"
									/>
								))}
							</div>
						)}
					</Card>
				))}
			</div>

			<div className="mt-8">
				<h3 className="text-xl font-semibold mb-4">Type Definitions</h3>
				<CodeBlock
					language="typescript"
					code={`
export interface FileTreeProps {
  structure: FileStructure
  theme?: 'light' | 'dark' | ThemeConfig
  enableFileIcons?: boolean
  showIndentationLines?: boolean
  indentationWidth?: number
  enableDragAndDrop?: boolean
  enableMultiSelect?: boolean
  // ... more props
}

export type FileStructure = {
  [key: string]: FileStructure | null
}

export interface ThemeConfig {
  background: string
  text: string
  hover: string
  selected: string
  border: string
  // ... more theme options
}`}
				/>
			</div>
		</section>
	)
}
