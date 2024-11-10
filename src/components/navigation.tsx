'use client'

import { useAuth } from '@/providers/auth-provider'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from './logo'
import { ThemeToggle } from './theme-toggle'

type NavigationProps = {
	initialUser?: any
	isAuthenticated?: boolean
}

export default function Navigation({}: NavigationProps) {
	const { isAuthenticated, user } = useAuth()
	const pathname = usePathname()
	const isAuthPage = pathname === '/sign-in' || pathname === '/sign-up'

	// Don't show navigation on auth pages
	if (isAuthPage) {
		return null
	}

	const navItems = [
		{
			label: 'Documentation',
			href: '/docs',
			dropdown: [
				{
					label: 'Getting Started',
					href: '/docs/getting-started',
					description: 'Quick start guide and installation'
				},
				{
					label: 'API Reference',
					href: '/docs/api',
					description: 'Detailed API documentation'
				}
			]
		},
		{ label: 'Changelog', href: '/changelog' },
	]

	const authButtons = isAuthenticated ? [
		{ 
			label: 'Dashboard', 
			href: '/dashboard',
			buttonStyle: 'secondary'
		},
		{ 
			label: 'Sign out', 
			href: '/api/auth/signout',
			buttonStyle: 'primary'
		}
	] : [
		{
			label: 'Sign in',
			href: '/sign-in',
			buttonStyle: 'secondary'
		},
		{
			label: 'Sign up',
			href: '/sign-up',
			buttonStyle: 'primary'
		}
	]

	return (
		<nav className="fixed max-w-page-size w-[80vw] mx-auto top-4 left-0 right-0 z-50 border border-[#969799] dark:border-neutral-800 bg-[#e3e4e6]/30 dark:bg-black/30 backdrop-blur-lg rounded-2xl">
			<div className="mx-auto px-4">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center gap-4">
						<Link href="/" className="flex items-center">
							<Logo />
						</Link>

						<div className="hidden md:flex items-center gap-6">
							{navItems.map((item, index) => (
								<Link
									key={index}
									href={item.href}
									className="text-sm text-neutral-400 hover:text-white transition-colors"
								>
									{item.label}
								</Link>
							))}
						</div>
					</div>

					<div className="flex items-center gap-4">
						{isAuthenticated && (
							<span className="text-sm text-neutral-400">
								{user?.email}
							</span>
						)}
						<ThemeToggle />
						{authButtons.map((item, index) => (
							<Link
								key={index}
								href={item.href}
								className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
									item.buttonStyle === 'primary' 
										? 'bg-purple-500 hover:bg-purple-600 text-white'
										: 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
								}`}
							>
								{item.label}
							</Link>
						))}
					</div>
				</div>
			</div>
		</nav>
	)
}
