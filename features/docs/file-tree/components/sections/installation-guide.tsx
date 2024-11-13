// src/features/docs/components/sections/installation-guide.tsx
'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CodeBlock } from '@/features/docs/components/code-block/code-block'
import { CheckIcon, InfoIcon } from 'lucide-react'

export function InstallationGuide() {
	return (
		<section className="space-y-12" id="installation">
			<div className="space-y-4">
				<h2 className="text-3xl font-bold">Installation</h2>
				<p className="text-xl text-zinc-400">
					Get started with FileTree in your React project
				</p>
			</div>

			{/* Prerequisites */}
			<Card>
				<CardHeader>
					<CardTitle>Prerequisites</CardTitle>
					<CardDescription>
						Make sure you have the following installed
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<ul className="space-y-2">
						<li className="flex items-center gap-2">
							<CheckIcon className="w-4 h-4 text-green-500" />
							<span>Node.js 16.8 or later</span>
						</li>
						<li className="flex items-center gap-2">
							<CheckIcon className="w-4 h-4 text-green-500" />
							<span>React 18 or later</span>
						</li>
						<li className="flex items-center gap-2">
							<CheckIcon className="w-4 h-4 text-green-500" />
							<span>TypeScript 4.5 or later (recommended)</span>
						</li>
					</ul>
				</CardContent>
			</Card>

			{/* Installation Steps */}
			<Card>
				<CardHeader>
					<CardTitle>Installation</CardTitle>
					<CardDescription>
						Choose your preferred package manager
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="npm" className="space-y-4">
						<TabsList>
							<TabsTrigger value="npm">npm</TabsTrigger>
							<TabsTrigger value="pnpm">pnpm</TabsTrigger>
							<TabsTrigger value="yarn">yarn</TabsTrigger>
							<TabsTrigger value="bun">bun</TabsTrigger>
						</TabsList>

						<TabsContent value="npm">
							<CodeBlock
								language="bash"
								code="npm install @/components/file-tree"
							/>
						</TabsContent>

						<TabsContent value="pnpm">
							<CodeBlock
								language="bash"
								code="pnpm add @/components/file-tree"
							/>
						</TabsContent>

						<TabsContent value="yarn">
							<CodeBlock
								language="bash"
								code="yarn add @/components/file-tree"
							/>
						</TabsContent>

						<TabsContent value="bun">
							<CodeBlock
								language="bash"
								code="bun add @/components/file-tree"
							/>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Basic Usage</CardTitle>
					<CardDescription>
						Add FileTree to your React application
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<CodeBlock
						language="tsx"
						code={`
import { FileTree } from '@/components/file-tree'

export default function App() {
  const structure = {
    'src': {
      'components': {
        'Button.tsx': null,
        'Input.tsx': null,
      },
      'pages': {
        'index.tsx': null,
        'about.tsx': null,
      },
    },
    'package.json': null,
    'README.md': null,
  }

  return (
    <FileTree
      structure={structure}
      enableFileIcons
      showIndentationLines
    />
  )
}`}
						fileName="app.tsx"
					/>

					<Alert>
						<InfoIcon className="w-4 h-4" />
						<AlertTitle>TypeScript Support</AlertTitle>
						<AlertDescription>
							FileTree includes built-in TypeScript types. No
							additional type packages are required.
						</AlertDescription>
					</Alert>
				</CardContent>
			</Card>

			{/* Styling Setup */}
			<Card>
				<CardHeader>
					<CardTitle>Styling Setup</CardTitle>
					<CardDescription>
						Configure the required styles
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex items-center gap-2">
						<Badge variant="secondary">Tailwind CSS</Badge>
						<Badge variant="secondary">CSS Modules</Badge>
						<Badge variant="secondary">CSS-in-JS</Badge>
					</div>

					<Tabs defaultValue="tailwind" className="space-y-4">
						<TabsList>
							<TabsTrigger value="tailwind">
								Tailwind CSS
							</TabsTrigger>
							<TabsTrigger value="css">CSS Modules</TabsTrigger>
							<TabsTrigger value="styled">
								Styled Components
							</TabsTrigger>
						</TabsList>

						<TabsContent value="tailwind">
							<div className="space-y-4">
								<p className="text-sm text-zinc-400">
									Add the following to your
									tailwind.config.js:
								</p>
								<CodeBlock
									language="javascript"
									code={`
module.exports = {
  content: [
    // ...
    "./node_modules/@/components/file-tree/**/*.{js,ts,jsx,tsx}",
  ],
  // ...
}`}
									fileName="tailwind.config.js"
								/>
							</div>
						</TabsContent>

						<TabsContent value="css">
							<div className="space-y-4">
								<p className="text-sm text-zinc-400">
									Import the CSS file in your app:
								</p>
								<CodeBlock
									language="typescript"
									code={`
import '@/components/file-tree/styles.css'`}
									fileName="app.tsx"
								/>
							</div>
						</TabsContent>

						<TabsContent value="styled">
							<div className="space-y-4">
								<p className="text-sm text-zinc-400">
									No additional setup required. Styles are
									included in the components.
								</p>
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>

			{/* Next Steps */}
			<Card>
				<CardHeader>
					<CardTitle>Next Steps</CardTitle>
					<CardDescription>
						Explore more features and customization options
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 gap-4">
						<a
							href="#core-concepts"
							className="block p-4 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors"
						>
							<h3 className="font-medium">Core Concepts</h3>
							<p className="text-sm text-zinc-400">
								Learn the fundamentals of FileTree
							</p>
						</a>
						<a
							href="#examples"
							className="block p-4 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors"
						>
							<h3 className="font-medium">Examples</h3>
							<p className="text-sm text-zinc-400">
								See FileTree in action
							</p>
						</a>
					</div>
				</CardContent>
			</Card>
		</section>
	)
}
