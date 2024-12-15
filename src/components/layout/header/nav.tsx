'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/theme/logo'
import { useUser } from '@/contexts/user-context'
import UserMenu from '@/components/layout/header/user-menu'
import { Button } from '@/shared/components/ui/button'

type NavProps = {
	positionFixed?: boolean
}

export default function Nav({ positionFixed = true }: NavProps) {
	const pathname = usePathname()
	const { user, isLoading } = useUser()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	const isAuthPage = pathname === '/login' || pathname === '/register'

	if (!mounted || isAuthPage || isLoading) {
		return null
	}

	return (
		<header
			className={`flex h-16 items-center justify-between border-b border-border px-6 ${positionFixed ? 'fixed inset-x-0 top-0' : ''}`}
		>
			<div className="flex items-center gap-6">
				<Link
					href={user ? '/dashboard' : '/'}
					className="transition-opacity hover:opacity-80"
				>
					<Logo hasLink={false} />
				</Link>
				{user && (
					<Link
						href="/dashboard"
						className="text-sm text-muted-foreground hover:text-foreground transition-colors"
					>
						Dashboard
					</Link>
				)}
			</div>
			<div className="flex items-center gap-4">
				{user ? (
					<UserMenu user={user} />
				) : (
					<Button
						variant="ghost"
						className="text-sm text-muted-foreground hover:text-foreground"
						asChild
					>
						<Link href="/login">Sign in</Link>
					</Button>
				)}
			</div>
		</header>
	)
}
