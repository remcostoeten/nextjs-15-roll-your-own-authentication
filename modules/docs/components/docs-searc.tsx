'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'

interface SearchResult {
	title: string
	href: string
	content: string
}

export function DocsSearch() {
	const [open, setOpen] = useState(false)
	const [query, setQuery] = useState('')
	const [results, setResults] = useState<SearchResult[]>([])
	const router = useRouter()

	// Mock search function - in a real app, this would search through your documentation content
	const performSearch = useCallback((searchQuery: string) => {
		if (!searchQuery) {
			setResults([])
			return
		}

		// This is a mock implementation - you would replace this with actual search logic
		const mockResults: SearchResult[] = [
			{
				title: 'API Authentication',
				href: '/docs/api-authentication',
				content:
					'Learn how to authenticate API requests using JWT tokens.',
			},
			{
				title: 'User Data',
				href: '/docs/user-data',
				content: 'Access user data on the server and client side.',
			},
			{
				title: 'Storage Integration',
				href: '/docs/storage-integration',
				content:
					'Integrate storage solutions with user authentication.',
			},
		].filter(
			(item) =>
				item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.content.toLowerCase().includes(searchQuery.toLowerCase())
		)

		setResults(mockResults)
	}, [])

	useEffect(() => {
		performSearch(query)
	}, [query, performSearch])

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				setOpen((open) => !open)
			}
		}
		document.addEventListener('keydown', down)
		return () => document.removeEventListener('keydown', down)
	}, [])

	const handleSelect = (href: string) => {
		setOpen(false)
		router.push(href)
	}

	return (
		<>
			<Button
				variant="outline"
				className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
				onClick={() => setOpen(true)}
			>
				<span className="inline-flex">
					<Search className="mr-2 h-4 w-4" />
					Search docs...
				</span>
				<kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
					<span className="text-xs">⌘</span>K
				</kbd>
			</Button>
			<CommandDialog
				open={open}
				onOpenChange={setOpen}
			>
				<CommandInput
					placeholder="Search documentation..."
					value={query}
					onValueChange={setQuery}
				/>
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="Results">
						{results.map((result) => (
							<CommandItem
								key={result.href}
								onSelect={() => handleSelect(result.href)}
							>
								<div className="text-sm">
									<p className="font-medium">
										{result.title}
									</p>
									<p className="text-muted-foreground text-xs">
										{result.content}
									</p>
								</div>
							</CommandItem>
						))}
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	)
}
