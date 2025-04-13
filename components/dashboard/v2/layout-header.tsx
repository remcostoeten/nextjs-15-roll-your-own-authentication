'use client'

import { useState, useEffect } from 'react'
import {
	CircleHelp,
	Bell,
	Search,
	User,
	Archive,
	AlertTriangle,
	CheckCircle2,
	X,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { FeedbackModal } from './feedback-modal'
import { Portal } from './portal'

const notificationData = {
	inbox: [],
	archived: [
		{
			id: 1,
			title: 'Database backup completed',
			message:
				'Your weekly database backup has been completed successfully.',
			time: '2 days ago',
			icon: (
				<CheckCircle2
					size={16}
					className="text-emerald-500"
				/>
			),
			read: true,
		},
		{
			id: 2,
			title: 'Storage quota warning',
			message:
				"You're approaching 80% of your storage quota. Consider upgrading your plan.",
			time: '5 days ago',
			icon: (
				<AlertTriangle
					size={16}
					className="text-amber-500"
				/>
			),
			read: true,
		},
		{
			id: 3,
			title: 'Maintenance completed',
			message:
				'Scheduled maintenance has been completed. All services are now operational.',
			time: '1 week ago',
			icon: (
				<CheckCircle2
					size={16}
					className="text-emerald-500"
				/>
			),
			read: true,
		},
	],
}

export function LayoutHeader() {
	const [helpOpen, setHelpOpen] = useState(false)
	const [notificationsOpen, setNotificationsOpen] = useState(false)
	const [feedbackOpen, setFeedbackOpen] = useState(false)
	const [userMenuOpen, setUserMenuOpen] = useState(false)
	const [activeTab, setActiveTab] = useState('inbox')
	const [showFilters, setShowFilters] = useState(false)

	// Animation states
	const [helpExiting, setHelpExiting] = useState(false)
	const [notificationsExiting, setNotificationsExiting] = useState(false)
	const [userMenuExiting, setUserMenuExiting] = useState(false)

	const pathname = usePathname()

	// Convert pathname to breadcrumbs
	const getBreadcrumbs = () => {
		if (!pathname) return [{ label: 'Dashboard', path: '/' }]

		// If we're at the root, just return Dashboard
		if (pathname === '/') return [{ label: 'Dashboard', path: '/' }]

		// Start with Dashboard
		const breadcrumbs = [{ label: 'Dashboard', path: '/' }]

		// Add the rest of the path segments
		const segments = pathname.split('/').filter(Boolean)
		segments.forEach((segment, index) => {
			const path = `/${segments.slice(0, index + 1).join('/')}`
			breadcrumbs.push({
				label:
					segment.charAt(0).toUpperCase() +
					segment.slice(1).replace(/-/g, ' '),
				path,
			})
		})

		return breadcrumbs
	}

	const breadcrumbs = getBreadcrumbs()

	// Close all dropdowns with animation
	const closeAllDropdowns = () => {
		if (helpOpen) {
			setHelpExiting(true)
			setTimeout(() => {
				setHelpOpen(false)
				setHelpExiting(false)
			}, 200)
		}

		if (notificationsOpen) {
			setNotificationsExiting(true)
			setTimeout(() => {
				setNotificationsOpen(false)
				setNotificationsExiting(false)
			}, 200)
		}

		if (userMenuOpen) {
			setUserMenuExiting(true)
			setTimeout(() => {
				setUserMenuOpen(false)
				setUserMenuExiting(false)
			}, 200)
		}
	}

	// Handle toggling dropdowns with animation
	const toggleHelp = () => {
		if (helpOpen) {
			setHelpExiting(true)
			setTimeout(() => {
				setHelpOpen(false)
				setHelpExiting(false)
			}, 200)
		} else {
			closeAllDropdowns()
			setHelpOpen(true)
		}
	}

	const toggleNotifications = () => {
		if (notificationsOpen) {
			setNotificationsExiting(true)
			setTimeout(() => {
				setNotificationsOpen(false)
				setNotificationsExiting(false)
			}, 200)
		} else {
			closeAllDropdowns()
			setNotificationsOpen(true)
			setShowFilters(false)
		}
	}

	const toggleUserMenu = () => {
		if (userMenuOpen) {
			setUserMenuExiting(true)
			setTimeout(() => {
				setUserMenuOpen(false)
				setUserMenuExiting(false)
			}, 200)
		} else {
			closeAllDropdowns()
			setUserMenuOpen(true)
		}
	}

	const toggleFeedback = () => {
		closeAllDropdowns()
		setFeedbackOpen(!feedbackOpen)
	}

	// Close dropdowns when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			// We handle this in the Portal components
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	return (
		<div
			className="flex h-12 max-h-12 min-h-12 items-center bg-[#1E1E1E] border-b border-[#2E2E2E]"
			data-sentry-component="LayoutHeader"
			data-sentry-source-file="LayoutHeader.tsx"
		>
			<div className="hidden md:flex items-center px-4 h-full border-r border-[#2E2E2E]">
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
					<span className="text-sm text-white">
						remcostoeten's Org
					</span>
				</div>
			</div>

			{/* Breadcrumbs */}
			<div className="hidden md:flex items-center px-4 h-full">
				<div className="flex items-center gap-2">
					{breadcrumbs.map((crumb, index) => (
						<div
							key={crumb.path}
							className="flex items-center"
						>
							{index > 0 && (
								<span className="text-gray-500 mx-2">/</span>
							)}
							<span className="text-sm text-white">
								{crumb.label}
							</span>
						</div>
					))}
				</div>
			</div>

			<div className="flex items-center justify-center border-r border-[#2E2E2E] flex-0 md:hidden h-full aspect-square">
				<button
					title="Menu dropdown button"
					className="group/view-toggle ml-4 flex justify-center flex-col border-none space-x-0 items-start gap-1 !bg-transparent rounded-md min-w-[30px] w-[30px] h-[30px]"
				>
					<div className="h-px inline-block left-0 w-4 transition-all ease-out bg-gray-400 group-hover/view-toggle:bg-white p-0 m-0"></div>
					<div className="h-px inline-block left-0 w-3 transition-all ease-out bg-gray-400 group-hover/view-toggle:bg-white p-0 m-0"></div>
				</button>
			</div>
			<div className="relative flex flex-1 overflow-hidden">
				<div className="flex w-full items-center justify-between py-2 pl-1 pr-3 md:px-3 flex-nowrap overflow-x-auto no-scrollbar">
					<div className="flex items-center text-sm"></div>
					<div className="flex items-center gap-x-2">
						{/* Feedback Button */}
						<button
							className={`relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border text-white bg-transparent border-[#4E4E4E] hover:border-gray-400 focus-visible:outline-[#4E4E4E] ${feedbackOpen ? 'border-[#6E6E6E]' : ''} text-xs px-2.5 py-1 h-[26px] hidden md:flex transform hover:scale-105`}
							onClick={toggleFeedback}
						>
							<span className="truncate">Feedback</span>
						</button>

						{/* Notifications Button */}
						<div className="relative">
							<button
								className={`relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border text-white hover:bg-[#2E2E2E] shadow-none focus-visible:outline-[#4E4E4E] ${notificationsOpen ? 'bg-[#2E2E2E]' : ''} border-transparent text-xs py-1 h-[26px] group px-1 transform hover:scale-105`}
								onClick={toggleNotifications}
							>
								<div className="[&_svg]:h-[14px] [&_svg]:w-[14px] text-gray-400">
									<Bell
										className={`lucide lucide-bell transition-all duration-200 ${notificationsOpen ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}
									/>
								</div>
							</button>

							{/* Notifications Dropdown */}
							{notificationsOpen && (
								<Portal>
									<div
										className="fixed inset-0 z-[9998]"
										onClick={toggleNotifications}
									>
										<div
											className={`absolute right-4 top-12 w-[450px] bg-[#2E2E2E] rounded-md shadow-lg border border-[#3E3E3E] transition-all duration-300 ease-in-out ${notificationsExiting ? 'opacity-0 scale-95 translate-y-2' : 'opacity-100 scale-100 translate-y-0'}`}
											onClick={(e) => e.stopPropagation()}
										>
											<div className="px-4">
												<p className="pt-4 pb-1 text-sm text-white">
													Notifications
												</p>
												<div className="flex items-center">
													<div className="w-full">
														<div className="flex items-center">
															<div className="flex items-center border-b flex gap-5 grow border-none">
																<button
																	type="button"
																	onClick={() =>
																		setActiveTab(
																			'inbox'
																		)
																	}
																	className={`items-center justify-center whitespace-nowrap py-1.5 text-sm transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 border-b-2 ${activeTab === 'inbox' ? 'text-white border-white' : 'text-gray-400 hover:text-white border-transparent'} group px-0 flex gap-2`}
																>
																	Inbox
																	<div className="flex items-center justify-center text-xs rounded-full bg-[#3E3E3E] h-4 w-4">
																		0
																	</div>
																</button>
																<button
																	type="button"
																	onClick={() =>
																		setActiveTab(
																			'archived'
																		)
																	}
																	className={`items-center justify-center whitespace-nowrap py-1.5 text-sm transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 border-b-2 ${activeTab === 'archived' ? 'text-white border-white' : 'text-gray-400 hover:text-white border-transparent'} group px-0 flex gap-2`}
																>
																	Archived
																	<div className="flex items-center justify-center text-xs rounded-full bg-[#3E3E3E] h-4 w-4">
																		{
																			notificationData
																				.archived
																				.length
																		}
																	</div>
																</button>
															</div>
															<button
																onClick={() =>
																	setShowFilters(
																		!showFilters
																	)
																}
																className="relative justify-center cursor-pointer inline-flex items-center text-center rounded-md outline-none transition-all border text-white hover:bg-[#3E3E3E] border-transparent text-xs py-1 px-1 h-[26px] transform hover:rotate-90 duration-200"
															>
																<div className="[&_svg]:h-[14px] [&_svg]:w-[14px] text-gray-400">
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		width="24"
																		height="24"
																		viewBox="0 0 24 24"
																		fill="none"
																		stroke="currentColor"
																		strokeWidth="1"
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		className="lucide lucide-settings2"
																	>
																		<path d="M20 7h-9"></path>
																		<path d="M14 17H5"></path>
																		<circle
																			cx="17"
																			cy="17"
																			r="3"
																		></circle>
																		<circle
																			cx="7"
																			cy="7"
																			r="3"
																		></circle>
																	</svg>
																</div>
															</button>
														</div>
													</div>
												</div>
											</div>

											<div className="border-t border-[#3E3E3E]">
												<div className="flex flex-1 h-[400px] bg-[#1E1E1E] overflow-hidden">
													{showFilters ? (
														<div className="w-full p-4 animate-in fade-in slide-in-from-right duration-300">
															<div className="relative mb-4">
																<Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
																<input
																	type="text"
																	placeholder="Find filter..."
																	className="w-full bg-[#1E1E1E] border border-[#3E3E3E] rounded-md pl-8 pr-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all duration-200"
																/>
															</div>

															<div className="mb-4 animate-in fade-in slide-in-from-right duration-300 delay-100">
																<p className="text-xs text-gray-400 mb-2">
																	Status
																</p>
																<div className="flex items-center px-2 py-1.5 hover:bg-[#3E3E3E] rounded-md transition-colors duration-200">
																	<input
																		type="checkbox"
																		id="unread"
																		className="mr-2"
																	/>
																	<label
																		htmlFor="unread"
																		className="text-sm text-white"
																	>
																		Unread
																	</label>
																</div>
															</div>

															<div className="mb-4 animate-in fade-in slide-in-from-right duration-300 delay-150">
																<p className="text-xs text-gray-400 mb-2">
																	Priority
																</p>
																<div className="flex items-center px-2 py-1.5 hover:bg-[#3E3E3E] rounded-md transition-colors duration-200">
																	<div className="flex items-center mr-2">
																		<svg
																			width="16"
																			height="16"
																			viewBox="0 0 24 24"
																			fill="none"
																			xmlns="http://www.w3.org/2000/svg"
																		>
																			<rect
																				width="24"
																				height="24"
																				rx="4"
																				fill="#FACC15"
																				fillOpacity="0.2"
																			/>
																			<path
																				d="M12 8V12M12 16H12.01"
																				stroke="#FACC15"
																				strokeWidth="2"
																				strokeLinecap="round"
																			/>
																		</svg>
																	</div>
																	<label className="text-sm text-white">
																		Warning
																	</label>
																</div>
																<div className="flex items-center px-2 py-1.5 hover:bg-[#3E3E3E] rounded-md transition-colors duration-200">
																	<div className="flex items-center mr-2">
																		<svg
																			width="16"
																			height="16"
																			viewBox="0 0 24 24"
																			fill="none"
																			xmlns="http://www.w3.org/2000/svg"
																		>
																			<rect
																				width="24"
																				height="24"
																				rx="4"
																				fill="#EF4444"
																				fillOpacity="0.2"
																			/>
																			<path
																				d="M12 8V12M12 16H12.01"
																				stroke="#EF4444"
																				strokeWidth="2"
																				strokeLinecap="round"
																			/>
																		</svg>
																	</div>
																	<label className="text-sm text-white">
																		Critical
																	</label>
																</div>
															</div>

															<div className="mb-4 animate-in fade-in slide-in-from-right duration-300 delay-200">
																<p className="text-xs text-gray-400 mb-2">
																	Organizations
																</p>
																<div className="flex items-center px-2 py-1.5 hover:bg-[#3E3E3E] rounded-md transition-colors duration-200">
																	<input
																		type="checkbox"
																		id="org1"
																		className="mr-2"
																	/>
																	<label
																		htmlFor="org1"
																		className="text-sm text-white"
																	>
																		remcostoeten's
																		Org
																	</label>
																</div>
																<div className="flex items-center px-2 py-1.5 hover:bg-[#3E3E3E] rounded-md transition-colors duration-200">
																	<input
																		type="checkbox"
																		id="org2"
																		className="mr-2"
																	/>
																	<label
																		htmlFor="org2"
																		className="text-sm text-white"
																	>
																		remcostoeten's
																		Org
																	</label>
																</div>
															</div>

															<button className="w-full text-center text-sm text-emerald-500 hover:text-emerald-400 py-2 transition-colors duration-200 animate-in fade-in slide-in-from-right duration-300 delay-300">
																Reset filters
															</button>
														</div>
													) : (
														<div className="w-full overflow-y-auto">
															{activeTab ===
															'inbox' ? (
																<div className="flex flex-col gap-y-4 items-center flex-grow justify-center h-full animate-in fade-in duration-300">
																	<div className="shimmer bg-[#2E2E2E] p-3 rounded-full">
																		<Archive
																			size={
																				24
																			}
																			className="text-gray-400"
																		/>
																	</div>
																	<div className="flex flex-col gap-y-1 animate-in fade-in duration-300 delay-100">
																		<p className="text-gray-400 text-sm mx-auto text-center">
																			All
																			caught
																			up
																		</p>
																		<p className="text-gray-500 text-xs w-60 mx-auto text-center">
																			You
																			will
																			be
																			notified
																			here
																			for
																			any
																			notices
																			on
																			your
																			organizations
																			and
																			projects
																		</p>
																	</div>
																</div>
															) : (
																<div className="p-2">
																	{notificationData.archived.map(
																		(
																			notification,
																			index
																		) => (
																			<div
																				key={
																					notification.id
																				}
																				className="p-3 hover:bg-[#2E2E2E] rounded-md transition-colors duration-200 mb-1 animate-in fade-in slide-in-from-top duration-300"
																				style={{
																					animationDelay: `${index * 50}ms`,
																				}}
																			>
																				<div className="flex items-start">
																					<div className="shimmer bg-[#2E2E2E] p-1.5 rounded-md mr-3">
																						{
																							notification.icon
																						}
																					</div>
																					<div className="flex-1 min-w-0">
																						<div className="flex items-center justify-between">
																							<h4 className="text-sm font-medium text-white truncate">
																								{
																									notification.title
																								}
																							</h4>
																							<div className="flex items-center ml-2">
																								<span className="text-xs text-gray-400 whitespace-nowrap">
																									{
																										notification.time
																									}
																								</span>
																								<button className="ml-2 text-gray-400 hover:text-white">
																									<X
																										size={
																											14
																										}
																									/>
																								</button>
																							</div>
																						</div>
																						<p className="text-xs text-gray-400 mt-1">
																							{
																								notification.message
																							}
																						</p>
																					</div>
																				</div>
																			</div>
																		)
																	)}
																</div>
															)}
														</div>
													)}
												</div>
											</div>
										</div>
									</div>
								</Portal>
							)}
						</div>

						{/* Help Button */}
						<div className="relative">
							<button
								className={`relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border text-white hover:bg-[#2E2E2E] shadow-none focus-visible:outline-[#4E4E4E] ${helpOpen ? 'bg-[#2E2E2E]' : ''} border-transparent text-xs py-1 h-[26px] px-1 pointer-events-auto transform hover:scale-105`}
								onClick={toggleHelp}
							>
								<div className="[&_svg]:h-[14px] [&_svg]:w-[14px] text-gray-400">
									<CircleHelp
										width={16}
										height={16}
										className={`lucide lucide-circle-help transition-all duration-200 ${helpOpen ? 'text-white' : 'text-gray-400 hover:text-white'}`}
									/>
								</div>
							</button>

							{/* Help Dropdown */}
							{helpOpen && (
								<Portal>
									<div
										className="fixed inset-0 z-[9998]"
										onClick={toggleHelp}
									>
										<div
											className={`absolute right-4 top-12 w-64 bg-[#2E2E2E] rounded-md shadow-lg border border-[#3E3E3E] transition-all duration-300 ease-in-out ${helpExiting ? 'opacity-0 scale-95 translate-y-2' : 'opacity-100 scale-100 translate-y-0'}`}
											onClick={(e) => e.stopPropagation()}
										>
											<div className="py-1">
												<a
													href="#"
													className="block px-4 py-2 text-sm text-white hover:bg-[#3E3E3E] transition-colors duration-200 animate-in fade-in slide-in-from-right duration-300"
												>
													Documentation
												</a>
												<a
													href="#"
													className="block px-4 py-2 text-sm text-white hover:bg-[#3E3E3E] transition-colors duration-200 animate-in fade-in slide-in-from-right duration-300 delay-50"
												>
													API Reference
												</a>
												<a
													href="#"
													className="block px-4 py-2 text-sm text-white hover:bg-[#3E3E3E] transition-colors duration-200 animate-in fade-in slide-in-from-right duration-300 delay-100"
												>
													Status
												</a>
												<a
													href="#"
													className="block px-4 py-2 text-sm text-white hover:bg-[#3E3E3E] transition-colors duration-200 animate-in fade-in slide-in-from-right duration-300 delay-150"
												>
													Support
												</a>
											</div>
										</div>
									</div>
								</Portal>
							)}
						</div>

						{/* User Menu Button */}
						<div className="relative ml-2">
							<button
								className={`relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border text-white hover:bg-[#2E2E2E] shadow-none focus-visible:outline-[#4E4E4E] ${userMenuOpen ? 'bg-[#2E2E2E]' : ''} border-transparent text-xs py-1 h-[26px] px-1 pointer-events-auto transform hover:scale-105`}
								onClick={toggleUserMenu}
							>
								<div className="[&_svg]:h-[14px] [&_svg]:w-[14px] text-gray-400">
									<User
										width={16}
										height={16}
										className={`lucide lucide-user transition-all duration-200 ${userMenuOpen ? 'text-white' : 'text-gray-400 hover:text-white'}`}
									/>
								</div>
							</button>

							{/* User Menu Dropdown */}
							{userMenuOpen && (
								<Portal>
									<div
										className="fixed inset-0 z-[9998]"
										onClick={toggleUserMenu}
									>
										<div
											className={`absolute right-4 top-12 w-64 bg-[#2E2E2E] rounded-md shadow-lg border border-[#3E3E3E] transition-all duration-300 ease-in-out ${userMenuExiting ? 'opacity-0 scale-95 translate-y-2' : 'opacity-100 scale-100 translate-y-0'}`}
											onClick={(e) => e.stopPropagation()}
										>
											<div className="px-3 py-2 border-b border-[#3E3E3E] animate-in fade-in slide-in-from-top duration-300">
												<p className="text-sm font-medium text-white">
													remcostoeten
												</p>
												<p className="text-xs text-gray-400">
													remcostoeten@hotmail.com
												</p>
											</div>
											<div className="py-1">
												<button className="flex items-center w-full px-3 py-1.5 text-sm text-white hover:bg-[#3E3E3E] transition-colors duration-200 animate-in fade-in slide-in-from-right duration-300">
													<span>
														Account preferences
													</span>
												</button>
												<button className="flex items-center w-full px-3 py-1.5 text-sm text-white hover:bg-[#3E3E3E] transition-colors duration-200 animate-in fade-in slide-in-from-right duration-300 delay-50">
													<span>
														Feature previews
													</span>
												</button>
												<button className="flex items-center w-full px-3 py-1.5 text-sm text-white hover:bg-[#3E3E3E] transition-colors duration-200 animate-in fade-in slide-in-from-right duration-300 delay-100">
													<span>Command menu</span>
												</button>
											</div>
											<div className="py-1 border-t border-[#3E3E3E]">
												<p className="px-3 py-1 text-xs text-gray-400 animate-in fade-in slide-in-from-right duration-300 delay-150">
													Theme
												</p>
												<button className="flex items-center w-full px-3 py-1.5 text-sm text-white hover:bg-[#3E3E3E] transition-colors duration-200 animate-in fade-in slide-in-from-right duration-300 delay-200">
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
												<button className="flex items-center w-full px-3 py-1.5 text-sm text-white hover:bg-[#3E3E3E] transition-colors duration-200 animate-in fade-in slide-in-from-right duration-300 delay-250">
													<span>Light</span>
												</button>
												<button className="flex items-center w-full px-3 py-1.5 text-sm text-white hover:bg-[#3E3E3E] transition-colors duration-200 animate-in fade-in slide-in-from-right duration-300 delay-300">
													<span>Classic Dark</span>
												</button>
												<button className="flex items-center w-full px-3 py-1.5 text-sm text-white hover:bg-[#3E3E3E] transition-colors duration-200 animate-in fade-in slide-in-from-right duration-300 delay-350">
													<span>System</span>
												</button>
											</div>
											<div className="py-1 border-t border-[#3E3E3E]">
												<button className="flex items-center w-full px-3 py-1.5 text-sm text-white hover:bg-[#3E3E3E] transition-colors duration-200 animate-in fade-in slide-in-from-right duration-300 delay-400">
													<span>Log out</span>
												</button>
											</div>
										</div>
									</div>
								</Portal>
							)}
						</div>
					</div>
				</div>
				<div className="absolute md:hidden left-0 h-full w-3 bg-gradient-to-r from-[#1E1E1E] to-transparent pointer-events-none"></div>
				<div className="absolute md:hidden right-0 h-full w-3 bg-gradient-to-l from-[#1E1E1E] to-transparent pointer-events-none"></div>
			</div>

			{/* Feedback Modal */}
			<FeedbackModal
				isOpen={feedbackOpen}
				onClose={() => setFeedbackOpen(false)}
			/>
		</div>
	)
}
