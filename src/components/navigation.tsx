'use client'

import { siteConfig } from '@/core/config/site'
import { signOut } from '@/features/auth/actions/sign-out.action'
import type { SessionUser } from '@/features/auth/types'
import { GithubIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from 'ui'
import Logo from './logo'
import { ThemeToggle } from './theme-toggle'

type NavigationProps = {
	isAuthenticated: boolean
	initialUser?: SessionUser
}

export default function Navigation({
	isAuthenticated,
	initialUser
}: NavigationProps) {
	const router = useRouter()

	const handleSignOut = async () => {
		await signOut()
	}

	return (
		<header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 max-w-screen-2xl items-center">
				<div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
					<div className="w-full flex justify-between items-center">
						<Logo />
						<nav className="flex items-center gap-2">
							<Link
								href={siteConfig.repository}
								target="_blank"
								rel="noreferrer"
							>
								<GithubIcon className="h-5 w-5" />
							</Link>
							<ThemeToggle />
							{isAuthenticated ? (
								<Button
									onClick={handleSignOut}
									variant="outline"
								>
									Sign out
								</Button>
							) : (
								<Button
									onClick={() => router.push('/sign-in')}
									variant="outline"
								>
									Sign in
								</Button>
							)}
						</nav>
					</div>
				</div>
			</div>
		</header>
	)
}
