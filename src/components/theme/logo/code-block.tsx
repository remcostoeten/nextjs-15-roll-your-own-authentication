'use client'

import { Button } from '@/shared/ui/button'
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger
} from '@/shared/ui/collapsible'
import { cn } from 'helpers'
import { Check, ChevronRight, Copy, RefreshCw } from 'lucide-react'
import { useState } from 'react'

interface CodeBlockProps {
	title: string
	code: string
	className?: string
	onReplay?: () => void
}

export function CodeBlock({
	title,
	code,
	className,
	onReplay
}: CodeBlockProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [hasCopied, setHasCopied] = useState(false)

	async function copyToClipboard(e: React.MouseEvent) {
		e.stopPropagation()
		await navigator.clipboard.writeText(code)
		setHasCopied(true)
		setTimeout(() => setHasCopied(false), 2000)
	}

	return (
		<Collapsible
			open={isOpen}
			onOpenChange={setIsOpen}
			className={cn('w-full space-y-2', className)}
		>
			<div className="flex items-center justify-between">
				<CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors duration-300">
					<ChevronRight
						className={cn(
							'h-4 w-4 transition-transform duration-200',
							isOpen && 'rotate-90'
						)}
					/>
					<span>View {title} Code</span>
				</CollapsibleTrigger>
				<div className="flex items-center gap-2">
					{onReplay && (
						<Button
							variant="ghost"
							size="sm"
							className="gap-2 text-xs"
							onClick={(e) => {
								e.stopPropagation()
								onReplay()
							}}
						>
							<RefreshCw className="h-3 w-3" />
							<span>Replay</span>
						</Button>
					)}
					<Button
						variant="ghost"
						size="sm"
						className="gap-2 text-xs"
						onClick={copyToClipboard}
					>
						{hasCopied ? (
							<>
								<Check className="h-3 w-3" />
								<span>Copied!</span>
							</>
						) : (
							<>
								<Copy className="h-3 w-3" />
								<span>Copy</span>
							</>
						)}
					</Button>
				</div>
			</div>
			<CollapsibleContent className="space-y-2">
				<div className="rounded-md bg-muted/50 p-4 transition-colors duration-300">
					<pre className="max-h-[400px] overflow-auto whitespace-pre-wrap break-all text-sm">
						<code className="block transition-colors duration-300">
							{code}
						</code>
					</pre>
				</div>
			</CollapsibleContent>
		</Collapsible>
	)
}
