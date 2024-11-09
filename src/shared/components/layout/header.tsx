'use client'

import { useAuth } from '@/hooks/use-auth'
import DocsMenu from './docs-menu'

export default function Header() {
	const { isAuthenticated } = useAuth()

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 items-center">
				<div className="mr-4 flex">
					{/* Your existing logo/brand */}
				</div>

				<div className="flex items-center justify-between flex-1">
					<nav className="flex items-center space-x-6">
						{/* Your existing navigation items */}
						{isAuthenticated && <DocsMenu />}
					</nav>

					<div className="flex items-center justify-end space-x-4">
						{/* Your existing right-side items (user menu, etc) */}
					</div>
				</div>
			</div>
		</header>
	)
}
