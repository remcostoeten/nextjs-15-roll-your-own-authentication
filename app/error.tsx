'use client'

import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/features/docs/components/code-block/code-block'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { useEffect } from 'react'

export default function Error({
	error,
	reset
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => {
		console.error(error)
	}, [error])

	const errorCode = `// Error: ${error.name}
${error.message}

// Stack Trace:
${error.stack}

// Error Details:
${error.digest ? `Error ID: ${error.digest}` : 'No error ID available'}
${Object.entries(error)
	.filter(([key]) => !['name', 'message', 'stack', 'digest'].includes(key))
	.map(([key, value]) => `${key}: ${JSON.stringify(value, null, 2)}`)
	.join('\n')}`

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="max-w-2xl w-full space-y-8">
				<div className="relative">
					<div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
					<div className="relative bg-black/40 backdrop-blur-sm border border-white/10 w-20 h-20 rounded-2xl mx-auto flex items-center justify-center">
						<AlertTriangle className="w-10 h-10 text-red-500" />
					</div>
				</div>
				<div className="space-y-2 text-center">
					<h2 className="text-2xl font-semibold text-white">
						Something went wrong!
					</h2>
					<p className="text-gray-400">
						{error.message || 'An unexpected error occurred'}
					</p>
					{error.digest && (
						<p className="text-sm text-gray-500 font-mono">
							Error ID: {error.digest}
						</p>
					)}
				</div>

				<div className="flex justify-center pt-4">
					<Button
						onClick={reset}
						className="bg-neutral-200 transition-all duration-400 hover:bg-neutral-400"
					>
						<RotateCcw className="w-4 h-4 mr-2" />
						Try Again
					</Button>
				</div>

				{process.env.NODE_ENV === 'development' && (
					<div className="mt-8">
						<details className="group">
							<summary className="cursor-pointer text-sm text-gray-400 hover:text-white mb-4">
								Technical Details
							</summary>
							<CodeBlock
								code={errorCode}
								language="typescript"
								fileName="error-stack.ts"
								showLineNumbers
								enableLineHighlight
								showMetaInfo
								badges={[
									{ text: 'Error', variant: 'danger' },
									{ text: error.name, variant: 'warning' },
									{
										text: 'Development',
										variant: 'secondary'
									}
								]}
								maxHeight="400px"
								onCopy={() => {
									navigator.clipboard.writeText(errorCode)
								}}
							/>
						</details>
					</div>
				)}
			</div>
		</div>
	)
}
