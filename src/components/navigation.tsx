'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { useAuthState } from '@/features/auth/hooks/use-auth-state'
import type { SessionUser } from '@/features/auth/types'
import useKeyboardShortcut from '@/hooks/use-keyboard-shortcut'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Logo from './logo'

type NavigationProps = {
	isAuthenticated: boolean
	initialUser?: SessionUser
}

type NavItem = {
	label: string
	href: string
	shortcut?: string
	buttonStyle?: 'primary' | 'secondary'
}

type TooltipProps = {
	content: string
	children: React.ReactNode
	position?: 'top' | 'bottom'
}

const Tooltip = ({ content, children, position = 'bottom' }: TooltipProps) => (
	<div className="group relative inline-flex">
		{children}
		<div
			className="absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#1D1D1D] text-white text-sm px-2 py-1 rounded-lg whitespace-nowrap z-50"
			style={{
				[position === 'bottom' ? 'top' : 'bottom']: '100%',
				left: '50%',
				transform: 'translateX(-50%)',
				marginTop: position === 'bottom' ? '0.5rem' : '',
				marginBottom: position === 'top' ? '0.5rem' : ''
			}}
		>
			{content}
			<div
				className="absolute w-2 h-2 bg-[#1D1D1D] rotate-45"
				style={{
					[position === 'bottom' ? 'top' : 'bottom']: '-0.25rem',
					left: '50%',
					transform: 'translateX(-50%)'
				}}
			/>
		</div>
	</div>
)

export default function Navigation({
	isAuthenticated,
	initialUser
}: NavigationProps) {
	const { isAuthenticated: authState, isLoading } = useAuthState({
		isAuthenticated,
		initialUser
	})
	const router = useRouter()
	const [mounted, setMounted] = useState(false)

	const navItems: NavItem[] = authState
		? [
				{ label: 'Dashboard', href: '/dashboard', shortcut: 'D' },
				{ label: 'Settings', href: '/settings' },
				{
					label: 'Sign out',
					href: '/signout',
					buttonStyle: 'secondary'
				}
			]
		: [
				{ label: 'Features', href: '/features' },
				{ label: 'Pricing', href: '/pricing' },
				{ label: 'Sign up', href: '/signup', buttonStyle: 'secondary' },
				{
					label: 'Sign in',
					href: '/signin',
					buttonStyle: 'primary',
					shortcut: 'L'
				}
			]

	useKeyboardShortcut({
		shortcuts: navItems
			.filter((item) => item.shortcut)
			.map((item) => ({
				key: item.shortcut!,
				action: () => item.href && router.push(item.href),
				enabled: mounted
			}))
	})

	useEffect(() => {
		setMounted(true)
	}, [])

	const getButtonClasses = (buttonStyle?: 'primary' | 'secondary') => {
		const baseClasses =
			'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5'
		return buttonStyle === 'primary'
			? `${baseClasses} bg-white hover:bg-white/90 text-black`
			: buttonStyle === 'secondary'
				? `${baseClasses} bg-[#1D1D1D] hover:bg-[#2D2D2D] text-white`
				: baseClasses
	}

	if (isLoading || !mounted) {
		return (
			<nav className="fixed max-w-[1024px] w-[80vw] mx-auto top-4 left-0 right-0 z-50 border border-white/[0.08] bg-black/30 backdrop-blur-lg rounded-2xl">
				<div className="mx-auto px-6">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center gap-4">
							<Skeleton className="w-8 h-8 rounded-full" />
							<div className="hidden md:flex items-center gap-6">
								{[1, 2].map((i) => (
									<Skeleton key={i} className="w-16 h-4" />
								))}
							</div>
						</div>
						<div className="flex items-center gap-2">
							{[1, 2].map((i) => (
								<Skeleton
									key={i}
									className="w-20 h-8 rounded-xl"
								/>
							))}
						</div>
					</div>
				</div>
			</nav>
		)
	}

	return (
		<nav className="fixed max-w-[1024px] w-[80vw] mx-auto top-4 left-0 right-0 z-50 border border-white/[0.08] bg-black/30 backdrop-blur-lg rounded-2xl">
			<div className="mx-auto px-6">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center gap-4">
						<Link href="/" className="flex items-center">
							<Logo fill="#E5E7EB" />
						</Link>

						<div className="hidden md:flex items-center gap-6">
							{navItems.map(
								(item, index) =>
									!item.buttonStyle && (
										<Link
											key={index}
											href={item.href}
											className="text-sm text-[#ADADAD] hover:text-white transition-colors"
										>
											{item.label}
										</Link>
									)
							)}
						</div>
					</div>

					<div className="flex items-center gap-2">
						{navItems.map(
							(item, index) =>
								item.buttonStyle && (
									<Tooltip
										key={index}
										content={
											item.shortcut
												? `Press ${item.shortcut} to ${item.label.toLowerCase()}`
												: ''
										}
									>
										<Link
											href={item.href}
											className={getButtonClasses(
												item.buttonStyle
											)}
										>
											{item.label}
											{item.shortcut && (
												<kbd className="ml-1.5 text-xs bg-black/10 px-2 py-0.5 rounded-md text-black/40 font-normal">
													{item.shortcut}
												</kbd>
											)}
										</Link>
									</Tooltip>
								)
						)}
					</div>
				</div>
			</div>
		</nav>
	)
}
