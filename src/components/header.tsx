'use client'

import { siteConfig } from '@/core/config/site'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from './logo'

const navItems = [
	{ href: '/', label: 'Home' },
	{ href: '/sign-in', label: 'Sign in' },
	{ href: '/sign-up', label: 'Sign up' },
	{ href: '/dashboard', label: 'Dashboard' }
]

export default function Header() {
	const pathname = usePathname()

	return (
		<header className="sticky py-2 border-b top-0 z-50 w-full border-b border-zinc-700 bg-black/50 backdrop-blur-sm">
			<div className="max-w-[1024px] mx-auto px-4 h-14">
				<div className="flex h-full items-center justify-between">
					<Link
						href="/"
						className="font-semibold flex items-center gap-2 text-lg hover:text-zinc-300 transition-colors"
					>
						<Logo fill="#E5E7EB" />
						<span>{siteConfig.name}</span>
					</Link>

					<nav className="flex items-center gap-1">
						{navItems.map(({ href, label }) => {
							const isActive = pathname === href
							return (
								<Link
									key={href}
									href={href}
									className={`
                    px-3 py-1.5 rounded-md text-sm font-medium
                    transition-colors duration-200
                    ${
						isActive
							? 'bg-white/10 text-white'
							: 'text-zinc-400 hover:text-white hover:bg-white/5'
					}
                  `}
								>
									{label}
								</Link>
							)
						})}
					</nav>
				</div>
			</div>
		</header>
	)
}
