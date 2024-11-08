'use client'

import { useAuthState } from '@/features/auth/hooks/use-auth-state'
import type { SessionUser } from '@/features/auth/types'
import useKeyboardShortcut from '@/hooks/use-keyboard-shortcut'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Logo from './logo'
import { ThemeToggle } from './theme-toggle'

type NavigationProps = {
	isAuthenticated: boolean
	initialUser?: SessionUser
}

type DropdownItem = {
	label: string
	href: string
	description?: string
}

type NavItem = {
	label: string
	href: string
	shortcut?: string
	buttonStyle?: 'primary' | 'secondary'
	dropdown?: DropdownItem[]
}

type SimpleTooltipProps = {
	content: string
	children: React.ReactNode
	position?: 'top' | 'bottom'
}

const SimpleTooltip = ({
	content,
	children,
	position = 'bottom'
}: SimpleTooltipProps) => (
	<div className="group relative inline-flex">
		{children}
		<div
			className="absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#f50000] text-white text-sm px-2 py-1 rounded-lg whitespace-nowrap z-50"
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
				className="absolute w-2 h-2 bg-[#c92525] rotate-45"
				style={{
					[position === 'bottom' ? 'top' : 'bottom']: '-0.25rem',
					left: '50%',
					transform: 'translateX(-50%)'
				}}
			/>
		</div>
	</div>
)

const Caret = ({ isOpen }: { isOpen: boolean }) => (
	<svg
		className={`w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] ${
			isOpen ? 'rotate-180' : ''
		}`}
		fill="none"
		strokeWidth="2"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path d="M19 9l-7 7-7-7" />
	</svg>
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
	const [isFocusedOnInput, setIsFocusedOnInput] = useState(false)
	const [openDropdown, setOpenDropdown] = useState<string | null>(null)
	const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(
		null
	)
	const [isDropdownHovered, setIsDropdownHovered] = useState(false)

	useEffect(() => {
		const checkFocus = () => {
			const activeElement = document.activeElement
			setIsFocusedOnInput(
				activeElement instanceof HTMLInputElement ||
					activeElement instanceof HTMLTextAreaElement ||
					activeElement?.hasAttribute('contenteditable')
			)
		}

		checkFocus()
		document.addEventListener('focusin', checkFocus)
		document.addEventListener('focusout', checkFocus)

		return () => {
			document.removeEventListener('focusin', checkFocus)
			document.removeEventListener('focusout', checkFocus)
		}
	}, [])

	const navItems: NavItem[] = authState
		? [
				{ label: 'Dashboard', href: '/dashboard', shortcut: 'd' },
				{ label: 'Settings', href: '/settings' },
				{
					label: 'Sign out',
					href: '/signout',
					buttonStyle: 'secondary'
				}
			]
		: [
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
						},
						{
							label: 'Examples',
							href: '/docs/examples',
							description: 'Code examples and use cases'
						}
					]
				},
				{ label: 'Changelog', href: '/changelog' },
				{
					label: 'Sign up',
					href: '/sign-up',
					buttonStyle: 'secondary'
				},
				{
					label: 'Sign in',
					href: '/sign-in',
					buttonStyle: 'primary',
					shortcut: 'l'
				}
			]

	useKeyboardShortcut([
		...navItems
			.filter((item) => item.shortcut)
			.map((item) => ({
				combo: {
					key: item.shortcut!,
					modifiers: ['meta']
				},
				action: () => router.push(item.href),
				enabled: mounted && !isFocusedOnInput,
				preventDefault: true
			})),
		// Add Shift+L shortcut for sign-in
		{
			combo: {
				key: 'l',
				modifiers: ['shift']
			},
			action: () => router.push('/sign-in'),
			enabled: mounted && !isFocusedOnInput && !authState,
			preventDefault: true
		},
		// Add Ctrl+L shortcut for sign-in
		{
			combo: {
				key: 'l',
				modifiers: ['ctrl']
			},
			action: () => router.push('/sign-in'),
			enabled: mounted && !isFocusedOnInput && !authState,
			preventDefault: true
		}
	])

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

	if (isLoading) {
		return (
			<header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-lg">
				<div className="container mx-auto px-4">
					<div className="flex h-16 items-center justify-between">
						{/* Logo Skeleton */}
						<div className="flex items-center gap-8">
							<div className="w-8 h-8 bg-white/[0.03] rounded-lg animate-pulse" />

							{/* Nav Links Skeleton */}
							<div className="hidden md:flex items-center gap-6">
								{[1, 2, 3].map((i) => (
									<div
										key={i}
										className="h-4 w-24 bg-white/[0.03] rounded animate-pulse"
									/>
								))}
							</div>
						</div>

						{/* Auth Buttons Skeleton */}
						<div className="flex items-center gap-4">
							<div className="relative overflow-hidden">
								<div className="h-9 w-24 bg-white/[0.03] rounded-md animate-pulse" />
								<div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
							</div>
							<div className="relative overflow-hidden">
								<div className="h-9 w-24 bg-white/[0.03] rounded-md animate-pulse" />
								<div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
							</div>
						</div>
					</div>
				</div>
			</header>
		)
	}

	return (
		<nav className="fixed max-w-page-size w-[80vw] mx-auto top-4 left-0 right-0 z-50 border border-neutral-800 bg-black/30 backdrop-blur-lg rounded-2xl">
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
										<div
											key={index}
											className="relative"
											onMouseEnter={() => {
												if (hoverTimeout)
													clearTimeout(hoverTimeout)
												setOpenDropdown(item.label)
											}}
											onMouseLeave={() => {
												const timeout = setTimeout(
													() => {
														if (
															!isDropdownHovered
														) {
															setOpenDropdown(
																null
															)
														}
													},
													100
												)
												setHoverTimeout(timeout)
											}}
										>
											<Link
												href={item.href}
												className="text-sm text-[#ADADAD] hover:text-white transition-colors flex items-center gap-1"
											>
												{item.label}
												{item.dropdown && (
													<Caret
														isOpen={
															openDropdown ===
															item.label
														}
													/>
												)}
											</Link>
											{item.dropdown && (
												<div
													className={`absolute top-full left-0 mt-2 w-64 bg-[#141414] border border-neutral-800 rounded-2xl overflow-visible shadow-lg transition-all duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] ${
														openDropdown ===
														item.label
															? 'opacity-100 translate-y-0'
															: 'opacity-0 translate-y-2 pointer-events-none'
													}`}
													onMouseEnter={() => {
														if (hoverTimeout)
															clearTimeout(
																hoverTimeout
															)
														setIsDropdownHovered(
															true
														)
													}}
													onMouseLeave={() => {
														setIsDropdownHovered(
															false
														)
														setOpenDropdown(null)
													}}
												>
													<div className="absolute -top-2 left-6 w-4 h-4">
														<div className="absolute inset-0 transform rotate-45">
															<div
																className={`absolute inset-0 border-l border-t border-neutral-800 transition-colors duration-200 ${
																	openDropdown ===
																	item.label
																		? 'bg-[#141414]'
																		: 'bg-[#141414]'
																}`}
															/>
														</div>
														<div className="absolute inset-[1px] transform rotate-45">
															<div
																className={`absolute inset-0 transition-colors duration-200 ${
																	openDropdown ===
																	item.label
																		? 'bg-[#141414]'
																		: 'bg-[#141414]'
																}`}
															/>
														</div>
													</div>

													{item.dropdown.map(
														(
															dropdownItem,
															dropdownIndex
														) => (
															<Link
																key={
																	dropdownIndex
																}
																href={
																	dropdownItem.href
																}
																className="block px-4 py-3 hover:bg-[#1D1D1D] transition-colors first:rounded-t-2xl last:rounded-b-2xl"
															>
																<div className="text-sm text-white">
																	{
																		dropdownItem.label
																	}
																</div>
																{dropdownItem.description && (
																	<div className="text-xs text-[#ADADAD] mt-0.5">
																		{
																			dropdownItem.description
																		}
																	</div>
																)}
															</Link>
														)
													)}
												</div>
											)}
										</div>
									)
							)}
						</div>
					</div>

					<div className="flex items-center gap-4">
						<ThemeToggle />
						{navItems.map(
							(item, index) =>
								item.buttonStyle &&
								(item.shortcut ? (
									<SimpleTooltip
										key={index}
										content={`Press ⌘/${navigator.platform.includes('Win') ? 'Ctrl' : '⌘'} + ${item.shortcut.toUpperCase()} or Shift + ${item.shortcut.toUpperCase()} to ${item.label.toLowerCase()}`}
									>
										<Link
											href={item.href}
											className={getButtonClasses(
												item.buttonStyle
											)}
										>
											{item.label}
											<kbd className="ml-1.5 text-xs bg-black/10 px-2 py-0.5 rounded-md text-black/40 font-normal">
												{navigator.platform.includes(
													'Win'
												)
													? 'Ctrl'
													: '⌘'}{' '}
												+ {item.shortcut.toUpperCase()}
											</kbd>
										</Link>
									</SimpleTooltip>
								) : (
									<Link
										key={index}
										href={item.href}
										className={getButtonClasses(
											item.buttonStyle
										)}
									>
										{item.label}
									</Link>
								))
						)}
					</div>
				</div>
			</div>
		</nav>
	)
}
