'use client'

import { Book } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from 'ui'

/**
 * Documentation menu component for the header, shown only to authenticated users.
 * Provides quick access to various documentation sections.
 *
 * @component
 * @author Remco Stoeten
 */
export default function DocsMenu() {
	const router = useRouter()

	const handleValueChange = (value: string) => {
		router.push(`/docs/${value}`)
	}

	return (
		<div className="flex items-center gap-2">
			<Select onValueChange={handleValueChange}>
				<SelectTrigger className="w-[180px] bg-background border-none">
					<div className="flex items-center gap-2">
						<Book className="h-4 w-4" />
						<SelectValue placeholder="Documentation" />
					</div>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="getting-started">
						Getting Started
					</SelectItem>
					<SelectItem value="authentication">
						Authentication
					</SelectItem>
					<SelectItem value="api-reference">API Reference</SelectItem>
					<SelectItem value="components">Components</SelectItem>
					<SelectItem value="examples">Examples</SelectItem>
				</SelectContent>
			</Select>
		</div>
	)
}
