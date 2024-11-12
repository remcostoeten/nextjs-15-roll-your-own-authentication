'use client'

import useAuth from '@/hooks/use-auth'
import { Logo } from '@/shared/components/logo'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from 'ui'

export default function Navigation() {
	const { isAuthenticated, signOut, isLoading } = useAuth()

	return (
		<header className="fixed top-4 left-0 right-0 z-50">
			<div className="max-w-page-size mx-auto px-4">
				<nav className="flex items-center justify-between h-16 px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border">
					<div className="flex items-center gap-8">
						{/* Logo */}
						<Link href="/" className="flex items-center">
							<Logo />
						</Link>

						{/* Navigation Links */}
						<div className="flex items-center gap-6">
							<Link
								href="/changelog"
								className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
							>
								Changelog
							</Link>

							{/* Docs Dropdown */}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary"
									>
										Docs
										<ChevronDown className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start">
									<DropdownMenuItem asChild>
										<Link href="/docs/getting-started">
											Getting Started
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href="/docs/api-reference">
											API Reference
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href="/docs/examples">
											Examples
										</Link>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					{/* Auth Buttons */}
					<div className="flex items-center gap-4">
						{isLoading ? (
							<div className="h-9 w-20 animate-pulse rounded bg-muted" />
						) : isAuthenticated ? (
							<Button variant="ghost" onClick={() => signOut()}>
								Sign out
							</Button>
						) : (
							<>
								<Button variant="ghost" asChild>
									<Link href="/sign-in">Sign in</Link>
								</Button>
								<Button asChild>
									<Link href="/sign-up">Sign up</Link>
								</Button>
							</>
						)}
					</div>
				</nav>
			</div>
		</header>
	)
}
