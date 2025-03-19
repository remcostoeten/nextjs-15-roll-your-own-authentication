'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

interface CliCommandProps {
	command: string
}

export function CliCommand({ command }: CliCommandProps) {
	const [copied, setCopied] = useState(false)

	const copyCommand = () => {
		navigator.clipboard.writeText(command)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<div className="cli-window">
			<span className="text-green-500">$</span> {command}
			<button
				onClick={copyCommand}
				className="copy-button"
			>
				{copied ? (
					<Check className="h-4 w-4 text-green-500" />
				) : (
					<Copy className="h-4 w-4" />
				)}
			</button>
		</div>
	)
}
