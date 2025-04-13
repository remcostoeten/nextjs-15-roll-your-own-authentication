'use client'

import type React from 'react'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
} from 'lucide-react'

export function Sidebar() {
	const pathname = usePathname()
	const [isExpanded, setIsExpanded] = useState(false)
	const [isHovering, setIsHovering] = useState(false)
	const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

	const [orgDropdownOpen, setOrgDropdownOpen] = useState(false)
	const [userDropdownOpen, setUserDropdownOpen] = useState(false)

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
					{/* Organization Header */}
					<div className="p-2 border-b border-[#2E2E2E]">
						<div className="relative">
							<button
								onClick={() =>
									setOrgDropdownOpen(!orgDropdownOpen)
								}
								className="flex items-center w-full text-left px-2 py-1.5 rounded-md hover:bg-[#2E2E2E] transition-colors"
							>
								<div className="flex items-center gap-2">
									<div className="bg-emerald-500 text-white p-0.5 rounded-md">
										<svg
											width="12"
											height="12"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M3 9L12 5L21 9L12 13L3 9Z"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											></path>
											<path
												d="M3 19L12 15L21 19L12 23L3 19Z"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											></path>
											<path
												d="M3 9V19"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											></path>
											<path
												d="M21 9V19"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											></path>
											<path
												d="M12 13V23"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											></path>
										</svg>
									</div>
									{isExpanded && (
										<>
											<span className="text-sm text-white truncate">
												remcostoeten's Org
											</span>
											<ChevronDown
												size={14}
												className="ml-auto text-gray-400"
											/>
										</>
									)}
								</div>
							</button>

							{/* Organization Dropdown */}
							{orgDropdownOpen && (
								<div className="absolute left-0 top-full mt-1 w-56 bg-[#2E2E2E] rounded-md shadow-lg z-50 border border-[#3E3E3E] py-1 animate-in fade-in slide-in-from-top-2 duration-200">
									<div className="px-2 py-1.5">
										<div className="relative">
											<Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
											<input
												type="text"
												placeholder="Find organization..."
												className="w-full bg-[#1E1E1E] border border-[#3E3E3E] rounded-md pl-8 pr-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
											/>
										</div>
									</div>
									<div className="max-h-60 overflow-y-auto">
										<button className="flex items-center w-full px-3 py-1.5 text-sm text-white hover:bg-[#3E3E3E]">
											<span>remcostoeten's Org</span>
											<svg
												className="ml-auto h-4 w-4 text-emerald-500"
												viewBox="0 0 24 24"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M20 6L9 17L4 12"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												></path>
											</svg>
										</button>
										<button className="flex items-center w-full px-3 py-1.5 text-sm text-white hover:bg-[#3E3E3E]">
											<span>remcostoeten's Org</span>
										</button>
									</div>
									<div className="border-t border-[#3E3E3E] px-2 py-1.5">
										<button className="flex items-center w-full px-2 py-1.5 text-sm text-white hover:bg-[#3E3E3E] rounded-md">
											<Plus
												size={14}
												className="mr-2 text-gray-400"
											/>
											<span>New organization</span>
										</button>
									</div>
								</div>
							)}
						</div>
					</div>

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
								label="Command Menu"
								href="/command"
								active={pathname === '/command'}
								isExpanded={isExpanded}
							/>
						</ul>

						<div className="mt-2">
							<div className="relative">
								<button
									onClick={() =>
										setUserDropdownOpen(!userDropdownOpen)
									}
									className="flex items-center w-full text-left px-2 py-1.5 rounded-md hover:bg-[#2E2E2E] transition-colors"
								>
									<div className="flex items-center gap-2">
										<div className="bg-white text-[#1E1E1E] h-6 w-6 rounded-md flex items-center justify-center">
											<User size={14} />
										</div>
										{isExpanded && (
											<span className="text-sm text-gray-400 truncate">
												remcostoeten
											</span>
										)}
									</div>
								</button>

								{/* User Dropdown */}
								{userDropdownOpen && (
									<div className="absolute left-0 bottom-full mb-1 w-56 bg-[#2E2E2E] rounded-md shadow-lg z-50 border border-[#3E3E3E] py-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
										<div className="px-3 py-2 border-b border-[#3E3E3E]">
											<p className="text-sm font-medium text-white">
												remcostoeten
											</p>
											<p className="text-xs text-gray-400">
												remcostoeten@hotmail.com
											</p>
										</div>
										<div className="py-1">
											<button className="flex items-center w-full px-3 py-1.5 text-sm text-white hover:bg-[#3E3E3E]">
												<span>Account preferences</span>
											</button>
											<button className="flex items-center w-full px-3 py-1.5 text-sm text-white hover:bg-[#3E3E3E]">
												<span>Feature previews</span>
											</button>
											<button className="flex items-center w-full px-3 py-1.5 text-sm text-white hover:bg-[#3E3E3E]">
												<span>Command menu</span>
											</button>
										</div>
										<div className="py-1 border-t border-[#3E3E3E]">
											<p className="px-3 py-1 text-xs text-gray-400">
												Theme
											</p>
											<button className="flex items-center w-full px-3 py-1.5 text-sm text-white hover:bg-[#3E3E3E]">
												<span>Dark</span>
												<svg
													className="ml-auto h-4 w-4 text-emerald-500"
													viewBox="0 0 24 24"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M20 6L9 17L4 12"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													></path>
												</svg>
											</button>
											<button className="flex items-center w-full px-3 py-1.5 text-sm text-white hover:bg-[#3E3E3E]">
												<span>Light</span>
											</button>
											<button className="flex items-center w-full px-3 py-1.5 text-sm text-white hover:bg-[#3E3E3E]">
												<span>Classic Dark</span>
											</button>
											<button className="flex items-center w-full px-3 py-1.5 text-sm text-white hover:bg-[#3E3E3E]">
												<span>System</span>
											</button>
										</div>
										<div className="py-1 border-t border-[#3E3E3E]">
											<button className="flex items-center w-full px-3 py-1.5 text-sm text-white hover:bg-[#3E3E3E]">
												<span>Log out</span>
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
