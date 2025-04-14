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
import { UserMenu } from '@/modules/authentication/components/user-menu'
import { useTheme } from 'next-themes'

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
	const [activeTab, setActiveTab] = useState('inbox')
	const [showFilters, setShowFilters] = useState(false)
	const [user, setUser] = useState<any>(null)

	// Animation states
	const [helpExiting, setHelpExiting] = useState(false)
	const [notificationsExiting, setNotificationsExiting] = useState(false)

	const pathname = usePathname()
	const { theme, setTheme } = useTheme()

	useEffect(() => {
		// Get user data from the window object (set by UserProvider)
		const userData = (window as any).__user
		if (userData) {
			setUser(userData)
		}
	}, [])

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
		<div className="flex h-12 max-h-12 min-h-12 items-center justify-between bg-[#1E1E1E] border-b border-[#2E2E2E] px-4">
			<div className="flex items-center gap-4">
				<div className="hidden md:flex items-center gap-2">
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
						{user?.username || 'Loading...'}'s Org
					</span>
				</div>
				<div className="flex items-center gap-2">
					{breadcrumbs.map((breadcrumb, index) => (
						<div
							key={breadcrumb.path}
							className="flex items-center"
						>
							{index > 0 && (
								<span className="mx-2 text-gray-500">/</span>
							)}
							<span className="text-sm text-gray-400">
								{breadcrumb.label}
							</span>
						</div>
					))}
				</div>
			</div>

			<div className="flex items-center gap-4">
				<div className="flex items-center gap-2">
					<button
						onClick={toggleHelp}
						className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-[#2E2E2E] transition-colors"
						aria-label="Help"
					>
						<CircleHelp className="h-5 w-5" />
					</button>
					<button
						onClick={toggleNotifications}
						className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-[#2E2E2E] transition-colors relative"
						aria-label="Notifications"
					>
						<Bell className="h-5 w-5" />
						{notificationData.inbox.length > 0 && (
							<span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
						)}
					</button>
				</div>
			</div>

			{/* Help Portal */}
			{helpOpen && (
				<Portal>
					<div
						className={`fixed right-0 top-12 z-50 w-80 border-l border-[#2E2E2E] bg-[#1E1E1E] p-4 shadow-lg transition-transform duration-200 ${
							helpExiting ? 'translate-x-full' : 'translate-x-0'
						}`}
					>
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-lg font-semibold">
								Help & Support
							</h2>
							<button
								onClick={toggleHelp}
								className="text-gray-400 hover:text-white"
							>
								<X className="h-5 w-5" />
							</button>
						</div>
						<div className="space-y-4">
							<button
								onClick={toggleFeedback}
								className="w-full text-left px-4 py-2 rounded-md hover:bg-[#2E2E2E] transition-colors"
							>
								Send Feedback
							</button>
							<a
								href="/docs"
								className="block px-4 py-2 rounded-md hover:bg-[#2E2E2E] transition-colors"
							>
								Documentation
							</a>
							<a
								href="/support"
								className="block px-4 py-2 rounded-md hover:bg-[#2E2E2E] transition-colors"
							>
								Contact Support
							</a>
						</div>
					</div>
				</Portal>
			)}

			{/* Notifications Portal */}
			{notificationsOpen && (
				<Portal>
					<div
						className={`fixed right-0 top-12 z-50 w-96 border-l border-[#2E2E2E] bg-[#1E1E1E] shadow-lg transition-transform duration-200 ${
							notificationsExiting
								? 'translate-x-full'
								: 'translate-x-0'
						}`}
					>
						<div className="flex items-center justify-between p-4 border-b border-[#2E2E2E]">
							<h2 className="text-lg font-semibold">
								Notifications
							</h2>
							<button
								onClick={toggleNotifications}
								className="text-gray-400 hover:text-white"
							>
								<X className="h-5 w-5" />
							</button>
						</div>
						<div className="flex items-center border-b border-[#2E2E2E]">
							<button
								className={`flex-1 p-2 text-center ${
									activeTab === 'inbox'
										? 'text-white border-b-2 border-white'
										: 'text-gray-400'
								}`}
								onClick={() => setActiveTab('inbox')}
							>
								Inbox
							</button>
							<button
								className={`flex-1 p-2 text-center ${
									activeTab === 'archived'
										? 'text-white border-b-2 border-white'
										: 'text-gray-400'
								}`}
								onClick={() => setActiveTab('archived')}
							>
								Archived
							</button>
						</div>
						<div className="p-4">
							{notificationData[
								activeTab as keyof typeof notificationData
							].length === 0 ? (
								<div className="text-center text-gray-400 py-8">
									No notifications
								</div>
							) : (
								<div className="space-y-4">
									{notificationData[
										activeTab as keyof typeof notificationData
									].map((notification) => (
										<div
											key={notification.id}
											className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#2E2E2E] transition-colors"
										>
											<div className="flex-shrink-0 mt-1">
												{notification.icon}
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium">
													{notification.title}
												</p>
												<p className="text-sm text-gray-400 mt-1">
													{notification.message}
												</p>
												<p className="text-xs text-gray-500 mt-1">
													{notification.time}
												</p>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</Portal>
			)}

			<FeedbackModal
				isOpen={feedbackOpen}
				onClose={() => setFeedbackOpen(false)}
			/>
		</div>
	)
}
