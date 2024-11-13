'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { ThemeSwitcher } from './theme-switcher'
import UserMenu from './user-menu'

type NavItem = {
	title: string
	href: string
}

const navItems: NavItem[] = [
	{ title: 'Home', href: '/' },
	{ title: 'Dashboard', href: '/dashboard' },
	{ title: 'Profile', href: '/profile' },
	{ title: 'Docs', href: '/docs' }
]

type HeaderProps = {
	user?: {
		email: string
		role?: string
		avatarUrl?: string | null
	} | null
}

export default function Header({ user }: HeaderProps) {
	const pathname = usePathname()

	const renderAuthButtons = useCallback(() => {
		if (user) {
			return <UserMenu user={user} />
		}

		return (
			<nav className="flex items-center space-x-2">
				<Button variant="ghost" asChild>
					<Link href="/login">Sign in</Link>
				</Button>
				<Button asChild>
					<Link href="/register">Sign up</Link>
				</Button>
			</nav>
		)
	}, [user])

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 items-center">
				<div className="mr-4 flex">
					<Link href="/" className="mr-6 flex items-center space-x-2">
						<span className="font-bold">Auth System</span>
					</Link>
					<nav className="flex items-center space-x-6 text-sm font-medium">
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={`transition-colors hover:text-foreground/80 ${
									pathname === item.href
										? 'text-foreground'
										: 'text-foreground/60'
								}`}
							>
								{item.title}
							</Link>
						))}
					</nav>
				</div>
				<div className="flex flex-1 items-center justify-end space-x-6">
					<ThemeSwitcher />
					{renderAuthButtons()}
				</div>
			</div>
		</header>
	)
}
