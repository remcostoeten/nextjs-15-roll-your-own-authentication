'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/src/shared/components/ui/button'

interface CopyButtonProps {
	text: string
}

export function CopyButton({ text }: CopyButtonProps) {
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		await navigator.clipboard.writeText(text)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<Button
			variant="ghost"
			size="icon"
			className="absolute top-3 right-3 h-8 w-8 text-gray-400 hover:text-white hover:bg-[#222222]"
			onClick={handleCopy}
		>
			{copied ? <Check size={16} /> : <Copy size={16} />}
		</Button>
	)
}
