'use client'

import Logo from '@/components/theme/logo'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ui/theme-toggle'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { NavItem, UserMenuProps, UserProfile } from './navigation'
import UserMenu from './user-menu'

const menu: NavItem[] = [
	{ title: 'Home', href: '/' },
	{ title: 'Dashboard', href: '/dashboard' },
	{ title: 'Docs', href: '/docs' },
]

export default function Header({ user }: { user: UserProfile | null }) {
	const pathname = usePathname()

	const renderAuthButtons = useCallback(() => {
		if (user?.email) {
			const userMenuProps: UserMenuProps = {
				email: user.email,
				role: user.role,
				avatarUrl: user.avatarUrl ?? null
			}
			return <UserMenu user={userMenuProps} />
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
				<div className="mr-4 gap-8 flex">
					<Logo size="sm" hasLink={true} />
					<nav className="flex items-center space-x-6 text-sm font-medium">
						{menu.map((item) => (
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
					<ModeToggle />
					{renderAuthButtons()}
				</div>
			</div>
		</header>
	)
}
