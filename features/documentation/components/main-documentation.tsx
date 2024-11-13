'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Code as CodeIcon, Copy, Play } from 'lucide-react'
import { useState } from 'react'

type DocComponentProps = {
	title: string
	description?: string
	component: React.ReactNode
	code: string
	installCommand?: string
	apiReference?: {
		props: Array<{
			name: string
			type: string
			default?: string
			description: string
		}>
	}
}

export default function Component({
	title = 'Example Component',
	description = 'A reusable React component with comprehensive documentation.',
	component = <div>Example Component</div>,
	code = 'const Example = () => <div>Example Component</div>',
	installCommand = 'npm install @example/ui',
	apiReference
}: DocComponentProps) {
	const [showCode, setShowCode] = useState(false)
	const [copied, setCopied] = useState(false)

	const copyToClipboard = async (text: string) => {
		await navigator.clipboard.writeText(text)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<div className="max-w-4xl mx-auto space-y-8 p-6">
			{/* Header Section */}
			<div className="space-y-2">
				<h1 className="text-4xl font-bold tracking-tight">{title}</h1>
				<p className="text-lg text-muted-foreground">{description}</p>
			</div>

			{/* Component Preview */}
			<Card>
				<CardHeader className="border-b">
					<div className="flex items-center justify-between">
						<CardTitle>Preview</CardTitle>
						<div className="flex gap-2">
							<Button
								variant={showCode ? 'outline' : 'default'}
								size="sm"
								onClick={() => setShowCode(false)}
							>
								<Play className="w-4 h-4 mr-2" />
								Preview
							</Button>
							<Button
								variant={showCode ? 'default' : 'outline'}
								size="sm"
								onClick={() => setShowCode(true)}
							>
								<CodeIcon className="w-4 h-4 mr-2" />
								Code
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent className="p-6">
					{showCode ? (
						<div className="relative">
							<pre className="overflow-x-auto p-4 rounded-lg bg-muted">
								<code className="text-sm">{code}</code>
							</pre>
							<Button
								size="sm"
								variant="ghost"
								className="absolute top-4 right-4"
								onClick={() => copyToClipboard(code)}
							>
								<Copy className="w-4 h-4" />
								<span className="sr-only">Copy code</span>
							</Button>
						</div>
					) : (
						<div className="flex items-center justify-center min-h-[200px]">
							{component}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Installation */}
			<section className="space-y-4">
				<h2 className="text-2xl font-semibold tracking-tight">
					Installation
				</h2>
				<div className="relative">
					<pre className="overflow-x-auto p-4 rounded-lg bg-muted">
						<code className="text-sm">{installCommand}</code>
					</pre>
					<Button
						size="sm"
						variant="ghost"
						className="absolute top-2 right-2"
						onClick={() => copyToClipboard(installCommand)}
					>
						<Copy className="w-4 h-4" />
						<span className="sr-only">Copy install command</span>
					</Button>
				</div>
			</section>

			{/* Info Quote */}
			<div className="p-4 rounded-lg border-l-4 border-green-500 bg-green-500/10">
				<p className="text-sm text-green-700 dark:text-green-300">
					This component is fully typed with TypeScript and includes
					comprehensive documentation.
				</p>
			</div>

			{/* API Reference */}
			{apiReference && (
				<section className="space-y-4">
					<h2 className="text-2xl font-semibold tracking-tight">
						API Reference
					</h2>
					<div className="border rounded-lg divide-y">
						{apiReference.props.map((prop, index) => (
							<div key={index} className="p-4 space-y-2">
								<div className="flex items-center gap-2">
									<code className="text-sm bg-muted px-1 py-0.5 rounded">
										{prop.name}
									</code>
									<span className="text-sm text-muted-foreground">
										{prop.type}
									</span>
									{prop.default && (
										<span className="text-sm text-muted-foreground">
											Default:{' '}
											<code className="bg-muted px-1 py-0.5 rounded">
												{prop.default}
											</code>
										</span>
									)}
								</div>
								<p className="text-sm text-muted-foreground">
									{prop.description}
								</p>
							</div>
						))}
					</div>
				</section>
			)}
		</div>
	)
}

// Inline Code Component
export function InlineCode({ children }: { children: React.ReactNode }) {
	return (
		<code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
			{children}
		</code>
	)
}

// Info Quote Component
export function InfoQuote({ children }: { children: React.ReactNode }) {
	return (
		<div className="my-6 rounded-lg border-l-4 border-green-500 bg-green-500/10 p-4">
			<div className="text-sm text-green-700 dark:text-green-300">
				{children}
			</div>
		</div>
	)
}
