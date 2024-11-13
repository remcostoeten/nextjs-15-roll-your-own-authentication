// src/features/docs/components/core-concepts.tsx
'use client'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CodeBlock } from '@/features/docs/components/code-block/code-block'
import { FileTree } from '@/features/docs/components/file-tree'
import {
	GripVertical as DragDropIcon,
	MousePointer2 as MouseIcon,
	MousePointerClickIcon
} from 'lucide-react'

export function CoreConcepts() {
	return (
		<section className="space-y-12" id="core-concepts">
			<div className="space-y-4">
				<h2 className="text-3xl font-bold">Core Concepts</h2>
				<p className="text-xl text-zinc-400">
					Understanding the fundamental concepts behind FileTree
				</p>
			</div>

			{/* File Structure */}
			<Card>
				<CardHeader>
					<CardTitle>File Structure</CardTitle>
					<CardDescription>
						Learn how to structure your data for FileTree
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<p className="text-zinc-400">
						FileTree uses a recursive object structure where folders
						are objects and files are null values. This intuitive
						format makes it easy to represent any file system
						hierarchy.
					</p>

					<div className="grid grid-cols-2 gap-6">
						<CodeBlock
							language="typescript"
							code={`
type FileStructure = {
  [key: string]: FileStructure | null
}

const structure = {
  'src': {                    // Folder
    'components': {           // Nested folder
      'Button.tsx': null,     // File
      'Input.tsx': null       // File
    },
    'pages': {
      'index.tsx': null,
      'about.tsx': null
    }
  },
  'package.json': null,       // Root file
  'README.md': null          // Root file
}`}
							fileName="types.ts"
						/>

						<div className="border rounded-lg border-zinc-800 p-4 bg-zinc-900">
							<FileTree
								structure={{
									src: {
										components: {
											'Button.tsx': null,
											'Input.tsx': null
										},
										pages: {
											'index.tsx': null,
											'about.tsx': null
										}
									},
									'package.json': null,
									'README.md': null
								}}
								enableFileIcons
								showIndentationLines
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Theming System */}
			<Card>
				<CardHeader>
					<CardTitle>Theming System</CardTitle>
					<CardDescription>
						Customize the appearance of your file tree
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="presets">
						<TabsList>
							<TabsTrigger value="presets">
								Preset Themes
							</TabsTrigger>
							<TabsTrigger value="custom">
								Custom Theme
							</TabsTrigger>
							<TabsTrigger value="tailwind">
								Tailwind Classes
							</TabsTrigger>
						</TabsList>

						<TabsContent value="presets" className="space-y-4">
							<p className="text-zinc-400">
								FileTree comes with built-in light and dark
								themes that follow your application&apos;s
								design system.
							</p>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<h4 className="font-medium">Light Theme</h4>
									<div className="rounded-lg border border-zinc-200 p-4 bg-white">
										<FileTree
											structure={{
												src: {
													components: {
														'Button.tsx': null
													}
												}
											}}
											theme="light"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<h4 className="font-medium">Dark Theme</h4>
									<div className="rounded-lg border border-zinc-800 p-4 bg-zinc-900">
										<FileTree
											structure={{
												src: {
													components: {
														'Button.tsx': null
													}
												}
											}}
											theme="dark"
										/>
									</div>
								</div>
							</div>
						</TabsContent>

						<TabsContent value="custom" className="space-y-4">
							<p className="text-zinc-400">
								Create your own theme by providing a custom
								theme configuration.
							</p>

							<CodeBlock
								language="typescript"
								code={`
const customTheme: ThemeConfig = {
  background: 'bg-[#1a1a1a]',
  text: 'text-zinc-100',
  textMuted: 'text-zinc-400',
  hover: 'hover:bg-[#2a2a2a]',
  selected: 'bg-blue-500/10',
  highlighted: 'bg-yellow-500/10',
  border: 'border-zinc-800',
  accent: 'text-blue-400',
  indent: 'border-l border-zinc-800',
}

<FileTree
  structure={structure}
  theme={customTheme}
/>`}
							/>
						</TabsContent>

						<TabsContent value="tailwind" className="space-y-4">
							<p className="text-zinc-400">
								Use Tailwind CSS classes to customize individual
								components.
							</p>

							<CodeBlock
								language="typescript"
								code={`
<FileTree
  className="rounded-lg border border-zinc-800"
  rowClassName="hover:bg-zinc-800"
  iconClassName="text-zinc-400"
  indentClassName="border-l border-zinc-800"
  structure={structure}
/>`}
							/>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>

			{/* Event System */}
			<Card>
				<CardHeader>
					<CardTitle>Event System</CardTitle>
					<CardDescription>
						Handle user interactions with the file tree
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<p className="text-zinc-400">
						FileTree provides a comprehensive event system for
						handling user interactions.
					</p>

					<div className="grid grid-cols-2 gap-6">
						<div className="space-y-4">
							<h4 className="font-medium">Available Events</h4>
							<ul className="space-y-3">
								<li className="flex items-start gap-2">
									<MouseIcon className="w-4 h-4 mt-1 text-zinc-400" />
									<div>
										<code className="text-sm">
											onSelect
										</code>
										<p className="text-sm text-zinc-400">
											Called when a file or folder is
											selected
										</p>
									</div>
								</li>
								<li className="flex items-start gap-2">
									<MousePointerClickIcon className="w-4 h-4 mt-1 text-zinc-400" />
									<div>
										<code className="text-sm">
											onToggle
										</code>
										<p className="text-sm text-zinc-400">
											Called when a folder is expanded or
											collapsed
										</p>
									</div>
								</li>
								<li className="flex items-start gap-2">
									<DragDropIcon className="w-4 h-4 mt-1 text-zinc-400" />
									<div>
										<code className="text-sm">onMove</code>
										<p className="text-sm text-zinc-400">
											Called when files are dragged and
											dropped
										</p>
									</div>
								</li>
							</ul>
						</div>

						<CodeBlock
							language="typescript"
							code={`
export default function App() {
  const handleSelect = (path: string) => {
    console.log('Selected:', path)
  }

  const handleToggle = (path: string, isOpen: boolean) => {
    console.log('Toggled:', path, isOpen)
  }

  const handleMove = (source: string, target: string) => {
    console.log('Moving from', source, 'to', target)
  }

  return (
    <FileTree
      structure={structure}
      onSelect={handleSelect}
      onToggle={handleToggle}
      onMove={handleMove}
      enableDragAndDrop
    />
  )
}`}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Icons System */}
			<Card>
				<CardHeader>
					<CardTitle>Icons System</CardTitle>
					<CardDescription>
						Understand how icons work in FileTree
					</CardDescription>
				</CardHeader>
				<CardContent>{/* Icon system content */}</CardContent>
			</Card>

			{/* Virtual Scrolling */}
			<Card>
				<CardHeader>
					<CardTitle>Virtual Scrolling</CardTitle>
					<CardDescription>
						Learn how FileTree handles large file structures
						efficiently
					</CardDescription>
				</CardHeader>
				<CardContent>{/* Virtual scrolling content */}</CardContent>
			</Card>
		</section>
	)
}
