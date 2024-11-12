'use client'

import { ChevronDown, Keyboard, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from 'ui'

const Logo = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className="h-6 w-6"
	>
		<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
	</svg>
)

const ThemeSwitcher = () => {
	const { theme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => setMounted(true), [])

	if (!mounted) return null

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
		>
			<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	)
}

export default function Header() {
	const [isOpen, setIsOpen] = useState(false)
	const router = useRouter()

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.altKey && event.key === 'l') {
				router.push('/sign-in')
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [router])

	return (
		<header className="fixed top-4 w-full">
			<nav className="container flex h-14 max-w-page-size items-center justify-between mx-auto rounded-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border/40">
				<div className="flex items-center gap-6">
					<Link
						href="/"
						className="flex items-center gap-2 font-semibold"
					>
						<Logo />
						Linear
					</Link>
					<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="flex items-center gap-1"
							>
								Docs{' '}
								<ChevronDown
									className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
								/>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56 animate-in slide-in-from-top-1 relative">
							<div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-popover border-t border-l border-border" />
							<DropdownMenuItem asChild>
								<Link href="/guides/server">Server</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href="/guides/client">Client</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href="/docs/getting-started">
									Getting Started
								</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<div className="flex items-center gap-2">
					<ThemeSwitcher />
					<Button variant="outline" className="text-sm">
						Sign up
					</Button>
					<Button className="text-sm flex items-center gap-2">
						Sign in
						<Keyboard className="h-4 w-4" />
					</Button>
				</div>
			</nav>
		</header>
	)
}
