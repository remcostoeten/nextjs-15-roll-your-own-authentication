'use client'

import { useState } from 'react'
import { Check, Copy, Terminal } from 'lucide-react'

type CodeWindowProps = {
	title: string
	code: string
	language?: string
}

export function CodeWindow({ title, code, language = 'typescript' }: CodeWindowProps) {
	const [copied, setCopied] = useState(false)

	const copyCode = () => {
		navigator.clipboard.writeText(code)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	const lines = code.trim().split('\n')

	return (
		<div className="rounded-md border border-[#1E1E1E] bg-[#0D0C0C] overflow-hidden">
			{/* Linux-style title bar */}
			<div className="flex items-center justify-between px-3 py-2 bg-[#1E1E1E] border-b border-[#2D2D2D]">
				<div className="flex items-center gap-2">
					<Terminal className="h-4 w-4 text-[#4e9815]" />
					<span className="text-xs font-mono text-[#8C877D]">
						<span className="text-[#4e9815]">user@arch</span>:
						<span className="text-[#666]">~/projects/auth</span>$ vim {title}
					</span>
				</div>
				<button
					onClick={copyCode}
					className="flex items-center gap-1.5 px-2 py-1 text-xs text-[#8C877D] hover:text-[#F2F0ED] transition-colors"
				>
					{copied ? (
						<>
							<Check className="h-3.5 w-3.5 text-[#4e9815]" />
							<span>copied</span>
						</>
					) : (
						<>
							<Copy className="h-3.5 w-3.5" />
							<span>yank</span>
						</>
					)}
				</button>
			</div>

			{/* Code content */}
			<div className="p-4 font-mono text-sm">
				{lines.map((line, i) => (
					<div
						key={i}
						className="flex"
					>
						<span className="select-none w-8 text-right pr-4 text-[#666]">{i + 1}</span>
						<span className={`token ${language}`}>{line}</span>
					</div>
				))}
			</div>

			{/* Vim-style status bar */}
			<div className="flex items-center justify-between px-3 py-1 bg-[#1E1E1E] border-t border-[#2D2D2D] text-xs font-mono">
				<span className="text-[#4e9815]">-- INSERT --</span>
				<span className="text-[#8C877D]">{title} | utf-8 | typescript | 100%</span>
			</div>
		</div>
	)
}
