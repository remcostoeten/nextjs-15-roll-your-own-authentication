'use client'

import type React from 'react'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
	Home,
	Database,
	FileText,
	Settings,
	Command,
	User,
	PanelLeftDashed,
	StoreIcon as Storage,
	LogInIcon as Auth,
	ChevronDown,
	Plus,
	Search,
	Calendar,
	CheckSquare,
	FileCode,
	Instagram,
	List,
	BarChart,
	Check,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { logout } from '@/modules/authentication/api/mutations'
import { customToast } from '@/components/ui/custom-toast'
import { CommandPalette } from '@/src/modules/search'

export function Sidebar() {
	const pathname = usePathname()
	const router = useRouter()
	const [isExpanded, setIsExpanded] = useState(false)
	const [isHovering, setIsHovering] = useState(false)
	const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
	const { theme, setTheme } = useTheme()
	const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

	const [orgDropdownOpen, setOrgDropdownOpen] = useState(false)
	const [userDropdownOpen, setUserDropdownOpen] = useState(false)
	const [user, setUser] = useState<any>(null)
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		// Get user data from the window object (set by UserProvider)
		const userData = (window as any).__user
		if (userData) {
			setUser(userData)
		}
	}, [])

	// Add keyboard shortcut for command palette
	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			// Don't handle keyboard shortcuts if we're in an input field (except for Escape)
			if (
				(e.key !== 'Escape' &&
					document.activeElement instanceof HTMLInputElement) ||
				document.activeElement instanceof HTMLTextAreaElement
			) {
				return
			}

			// Toggle command palette with Cmd/Ctrl + K
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				setCommandPaletteOpen(!commandPaletteOpen)
				return
			}

			// Close with Escape
			if (e.key === 'Escape' && commandPaletteOpen) {
				e.preventDefault()
				setCommandPaletteOpen(false)
				return
			}
		}

		document.addEventListener('keydown', down)
		return () => document.removeEventListener('keydown', down)
	}, [commandPaletteOpen])

	const handleLogout = async () => {
		try {
			setIsLoading(true)
			const result = await logout()

			if (result.success) {
				customToast.success({
					title: 'Logged out successfully',
					description: 'You have been logged out of your account.',
				})
				router.push('/login')
				router.refresh()
			} else {
				customToast.error({
					title: 'Logout failed',
					description: result.error || 'Something went wrong.',
				})
			}
		} catch (error) {
			console.error('Logout error:', error)
			customToast.error({
				title: 'Logout failed',
				description: 'An unexpected error occurred.',
			})
		} finally {
			setIsLoading(false)
		}
	}

	const handleMouseEnter = () => {
		if (hoverTimeoutRef.current) {
			clearTimeout(hoverTimeoutRef.current)
		}
		// Immediately set hovering state and expand sidebar with no delay
		setIsHovering(true)
		setIsExpanded(true)
	}

	const handleMouseLeave = () => {
		if (hoverTimeoutRef.current) {
			clearTimeout(hoverTimeoutRef.current)
		}
		setIsHovering(false)
		// Only add a small delay for collapsing to prevent flickering
		if (!orgDropdownOpen && !userDropdownOpen) {
			hoverTimeoutRef.current = setTimeout(() => {
				setIsExpanded(false)
			}, 150) // Reduced delay for collapsing
		}
	}

	// Keep sidebar open if dropdowns are open
	useEffect(() => {
		if (orgDropdownOpen || userDropdownOpen) {
			setIsExpanded(true)
		} else if (!isHovering) {
			setIsExpanded(false)
		}
	}, [orgDropdownOpen, userDropdownOpen, isHovering])

	const toggleSidebar = () => {
		setIsExpanded(!isExpanded)
	}

	return (
		<>
			<CommandPalette
				open={commandPaletteOpen}
				setOpen={setCommandPaletteOpen}
			/>
			<div
				className={`${isExpanded ? 'w-56' : 'w-12'} relative group peer hidden md:block text-sidebar-foreground flex-shrink-0 bg-[#1E1E1E] transition-all duration-150 ease-in-out`}
				data-state={isExpanded ? 'expanded' : 'collapsed'}
				data-collapsible="icon"
				data-variant="sidebar"
				data-side="left"
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				<div
					className={`absolute h-full inset-y-0 z-10 flex left-0 border-r border-[#2E2E2E] bg-[#1E1E1E] transition-all duration-150 ease-in-out ${isExpanded ? 'w-56' : 'w-12'}`}
					data-sentry-element="Sidebar"
					data-sentry-source-file="DefaultLayout.tsx"
				>
					<div
						data-sidebar="sidebar"
						className="flex h-full w-full flex-col bg-[#1E1E1E]"
					>
						<div
							data-sidebar="content"
							className="flex min-h-0 flex-1 flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-[#3E3E3E] scrollbar-track-transparent"
						>
							<ul className="flex w-full min-w-0 flex-col gap-1 p-2">
								<SidebarMenuItem
									icon={<Home />}
									label="Dashboard"
									href="/"
									active={pathname === '/'}
									isExpanded={isExpanded}
								/>
								<SidebarMenuItem
									icon={<Calendar />}
									label="Agenda"
									href="/agenda"
									active={pathname === '/agenda'}
									isExpanded={isExpanded}
								/>
								<SidebarMenuItem
									icon={<CheckSquare />}
									label="Tasks"
									href="/tasks"
									active={pathname === '/tasks'}
									isExpanded={isExpanded}
								/>
							</ul>

							<div className="h-[1px] bg-[#2E2E2E] w-[calc(100%-1rem)] mx-auto"></div>

							<ul className="flex w-full min-w-0 flex-col gap-1 p-2">
								<SidebarMenuItem
									icon={<Database />}
									label="Database"
									href="/database"
									active={pathname === '/database'}
									isExpanded={isExpanded}
								/>
								<SidebarMenuItem
									icon={<Auth />}
									label="Authentication"
									href="/auth"
									active={pathname === '/auth'}
									isExpanded={isExpanded}
								/>
								<SidebarMenuItem
									icon={<Storage />}
									label="Storage"
									href="/storage"
									active={pathname === '/storage'}
									isExpanded={isExpanded}
								/>
							</ul>

							<div className="h-[1px] bg-[#2E2E2E] w-[calc(100%-1rem)] mx-auto"></div>

							<ul className="flex w-full min-w-0 flex-col gap-1 p-2">
								<SidebarMenuItem
									icon={<FileCode />}
									label="Markdown Tool"
									href="/markdown-tool"
									active={pathname === '/markdown-tool'}
									isExpanded={isExpanded}
								/>
								<SidebarMenuItem
									icon={<Instagram />}
									label="Instagram Comparer"
									href="/instagram-comparer"
									active={pathname === '/instagram-comparer'}
									isExpanded={isExpanded}
								/>
								<SidebarMenuItem
									icon={<BarChart />}
									label="Reports"
									href="/reports"
									active={pathname === '/reports'}
									isExpanded={isExpanded}
								/>
								<SidebarMenuItem
									icon={<List />}
									label="Logs"
									href="/logs"
									active={pathname === '/logs'}
									isExpanded={isExpanded}
								/>
								<SidebarMenuItem
									icon={<FileText />}
									label="API Docs"
									href="/api-docs"
									active={pathname === '/api-docs'}
									isExpanded={isExpanded}
								/>
							</ul>
						</div>

						<div className="mt-auto border-t border-[#2E2E2E] p-2">
							<ul className="flex w-full min-w-0 flex-col gap-1">
								<SidebarMenuItem
									icon={<Settings />}
									label="Project Settings"
									href="/settings"
									active={pathname === '/settings'}
									isExpanded={isExpanded}
								/>
								<SidebarMenuItem
									icon={<Command />}
									label="Command Menu (⌘K)"
									onClick={() => setCommandPaletteOpen(true)}
									active={commandPaletteOpen}
									isExpanded={isExpanded}
								/>
							</ul>

							<div className="mt-2">
								<div className="relative">
									<button
										onClick={() =>
											setUserDropdownOpen(
												!userDropdownOpen
											)
										}
										className="flex items-center w-full text-left px-2 py-1.5 rounded-md hover:bg-[#2E2E2E] transition-colors"
									>
										<div className="flex items-center gap-2">
											<div className="bg-white text-[#1E1E1E] h-6 w-6 rounded-md flex items-center justify-center">
												<User size={14} />
											</div>
											{isExpanded && (
												<span className="text-sm text-gray-400 truncate">
													{user?.username ||
														'Loading...'}
												</span>
											)}
										</div>
									</button>

									{/* User Dropdown */}
									{userDropdownOpen && (
										<div className="absolute left-0 bottom-full mb-1 w-56 bg-[#2E2E2E] rounded-md shadow-lg z-50 border border-[#3E3E3E] py-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
											<div className="px-3 py-2 border-b border-[#3E3E3E]">
												<p className="text-sm font-medium text-white">
													{user?.username ||
														'Loading...'}
												</p>
												<p className="text-xs text-gray-400">
													{user?.email ||
														'Loading...'}
												</p>
											</div>
											<div className="py-1">
												<Link
													href="/profile"
													className="flex items-center w-full px-3 py-1.5 text-sm text-white hover:bg-[#3E3E3E]"
												>
													<span>
														Account preferences
													</span>
												</Link>
												<Link
													href="/previews"
													className="flex items-center w-full px-3 py-1.5 text-sm text-white hover:bg-[#3E3E3E]"
												>
													<span>
														Feature previews
													</span>
												</Link>
												<Link
													href="/command"
													className="flex items-center w-full px-3 py-1.5 text-sm text-white hover:bg-[#3E3E3E]"
												>
													<span>Command menu</span>
												</Link>
											</div>
											<div className="py-1 border-t border-[#3E3E3E]">
												<p className="px-3 py-1 text-xs text-gray-400">
													Theme
												</p>
												<button
													onClick={() =>
														setTheme('dark')
													}
													className="flex items-center w-full px-3 py-1.5 text-sm text-white hover:bg-[#3E3E3E]"
												>
													<span>Dark</span>
													{theme === 'dark' && (
														<Check className="ml-auto h-4 w-4 text-emerald-500" />
													)}
												</button>
												<button
													onClick={() =>
														setTheme('light')
													}
													className="flex items-center w-full px-3 py-1.5 text-sm text-white hover:bg-[#3E3E3E]"
												>
													<span>Light</span>
													{theme === 'light' && (
														<Check className="ml-auto h-4 w-4 text-emerald-500" />
													)}
												</button>
												<button
													onClick={() =>
														setTheme('classic-dark')
													}
													className="flex items-center w-full px-3 py-1.5 text-sm text-white hover:bg-[#3E3E3E]"
												>
													<span>Classic Dark</span>
													{theme ===
														'classic-dark' && (
														<Check className="ml-auto h-4 w-4 text-emerald-500" />
													)}
												</button>
												<button
													onClick={() =>
														setTheme('system')
													}
													className="flex items-center w-full px-3 py-1.5 text-sm text-white hover:bg-[#3E3E3E]"
												>
													<span>System</span>
													{theme === 'system' && (
														<Check className="ml-auto h-4 w-4 text-emerald-500" />
													)}
												</button>
											</div>
											<div className="py-1 border-t border-[#3E3E3E]">
												<button
													onClick={handleLogout}
													disabled={isLoading}
													className="flex items-center w-full px-3 py-1.5 text-sm text-white hover:bg-[#3E3E3E]"
												>
													{isLoading ? (
														<svg
															className="mr-2 h-4 w-4 animate-spin"
															xmlns="http://www.w3.org/2000/svg"
															fill="none"
															viewBox="0 0 24 24"
														>
															<circle
																className="opacity-25"
																cx="12"
																cy="12"
																r="10"
																stroke="currentColor"
																strokeWidth="4"
															></circle>
															<path
																className="opacity-75"
																fill="currentColor"
																d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
															></path>
														</svg>
													) : (
														<span>Log out</span>
													)}
												</button>
											</div>
										</div>
									)}
								</div>

								<button
									onClick={toggleSidebar}
									className="flex items-center justify-center w-6 h-6 mt-2 rounded-md hover:bg-[#2E2E2E] transition-colors"
									title={
										isExpanded
											? 'Collapse sidebar'
											: 'Expand sidebar'
									}
								>
									<PanelLeftDashed
										size={14}
										className="text-gray-400"
									/>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

interface SidebarMenuItemProps {
	icon: React.ReactNode
	label: string
	href?: string
	active?: boolean
	isExpanded: boolean
	onClick?: () => void
}

function SidebarMenuItem({
	icon,
	label,
	href,
	active = false,
	isExpanded,
	onClick,
}: SidebarMenuItemProps) {
	const Component = href ? Link : 'button'

	return (
		<li className="relative">
			<Component
				href={href || '#'}
				onClick={onClick}
				className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-md transition-colors ${active ? 'bg-[#2E2E2E] text-white' : 'text-gray-400 hover:bg-[#2E2E2E] hover:text-white'}`}
			>
				<span className="flex-shrink-0 [&>svg]:w-4 [&>svg]:h-4">
					{icon}
				</span>
				{isExpanded && <span className="truncate">{label}</span>}
			</Component>
		</li>
	)
}
