'use client'

import useAuthHeader from '@/hooks/use-auth-header'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Menu, Moon, Search, Sun, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from 'ui'

interface DropdownItem {
	label: string
	href: string
	description?: string
}

interface MenuItem {
	label: string
	href: string
	dropdownItems?: DropdownItem[]
	isNew?: boolean
}

// Search Modal Component
const SearchModal = ({
	isOpen,
	onClose
}: {
	isOpen: boolean
	onClose: () => void
}) => {
	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-50"
				>
					<div
						className="absolute inset-0 bg-black/60 backdrop-blur-sm"
						onClick={onClose}
					/>

					<motion.div
						initial={{ scale: 0.95, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.95, opacity: 0 }}
						className="relative max-w-2xl mx-auto mt-[15vh]"
					>
						<div className="m-4 bg-[#1C1C1C] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
							<div className="flex items-center p-4 border-b border-white/10">
								<Search className="w-5 h-5 text-white/40" />
								<input
									autoFocus
									placeholder="Search..."
									className="flex-1 ml-3 bg-transparent border-none outline-none text-white placeholder-white/40"
								/>
								<kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs text-white/40 bg-white/5 rounded">
									ESC
								</kbd>
							</div>
							<div className="p-4">
								<div className="text-sm text-white/40">
									No recent searches
								</div>
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

const DropdownMenu = ({
	items,
	isOpen
}: {
	items: DropdownItem[]
	isOpen: boolean
}) => {
	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-30"
						onClick={(e: { stopPropagation: () => any }) =>
							e.stopPropagation()
						}
					/>

					<motion.div
						initial={{ opacity: 0, y: 8, scale: 0.96 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 8, scale: 0.96 }}
						className={`
              absolute top-[120%] left-0
              min-w-[320px] p-2
              bg-[#141414] border border-white/[0.08]
              rounded-xl shadow-xl shadow-black/40
              backdrop-blur-xl
              z-40
            `}
					>
						{items.map((item) => (
							<Link
								key={item.label}
								href={item.href}
								className="relative flex flex-col gap-0.5 px-4 py-3 rounded-lg
                  text-white/70 hover:text-white
                  hover:bg-white/[0.06]
                  group"
							>
								<span className="font-medium text-[14px]">
									{item.label}
								</span>
								{item.description && (
									<span className="text-[13px] text-white/40 group-hover:text-white/50">
										{item.description}
									</span>
								)}
							</Link>
						))}
					</motion.div>
				</>
			)}
		</AnimatePresence>
	)
}

const MENU_ITEMS: MenuItem[] = [
	{ label: 'Home', href: '/' },
	{
		label: 'Pages',
		href: '#',
		dropdownItems: [
			{
				label: 'About',
				href: '/about',
				description: 'Learn more about us'
			},
			{
				label: 'Pricing',
				href: '/pricing',
				description: 'View pricing plans'
			},
			{
				label: 'Contact',
				href: '/contact',
				description: 'Get in touch'
			}
		]
	},
	{
		label: 'Components',
		href: '#',
		dropdownItems: [
			{
				label: 'UI Kit',
				href: '/components/ui',
				description: 'Essential interface elements'
			},
			{
				label: 'Icons',
				href: '/components/icons',
				description: 'Icon library and usage'
			},
			{
				label: 'Forms',
				href: '/components/forms',
				description: 'Form controls and validation'
			}
		]
	},
	{
		label: 'Blog',
		href: '#',
		dropdownItems: [
			{
				label: 'Latest Posts',
				href: '/blog',
				description: 'Recent articles'
			},
			{
				label: 'Categories',
				href: '/blog/categories',
				description: 'Browse by category'
			}
		]
	},
	{ label: 'Changelog', href: '/changelog', isNew: true }
]

const MobileMenu = ({
	isOpen,
	onClose,
	user,
	onSignOut
}: {
	isOpen: boolean
	onClose: () => void
	user: any
	onSignOut: () => void
}) => {
	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div>
					<div
						className="absolute inset-0 bg-black/50 backdrop-blur-sm"
						onClick={onClose}
					/>

					<motion.div
						initial={{ x: '100%' }}
						animate={{ x: 0 }}
						exit={{ x: '100%' }}
						className="absolute right-0 top-0 bottom-0 w-3/4 max-w-sm bg-zinc-900 border-l border-white/10"
					>
						<div className="flex flex-col h-full">
							<div className="flex items-center justify-between p-4 border-b border-white/10">
								<span className="text-lg font-medium text-white">
									Menu
								</span>
								<button
									onClick={onClose}
									className="p-2 text-white/60 hover:text-white"
								>
									<X size={24} />
								</button>
							</div>

							<nav className="flex-1 overflow-y-auto p-4">
								<div className="space-y-4">
									<Link
										href="/"
										className="block px-4 py-2 text-white/80 hover:text-white"
										onClick={onClose}
									>
										Home
									</Link>
									<Link
										href="/pages"
										className="block px-4 py-2 text-white/80 hover:text-white"
										onClick={onClose}
									>
										Pages
									</Link>
									<Link
										href="/components"
										className="block px-4 py-2 text-white/80 hover:text-white"
										onClick={onClose}
									>
										Components
									</Link>
									<Link
										href="/blog"
										className="block px-4 py-2 text-white/80 hover:text-white"
										onClick={onClose}
									>
										Blog
									</Link>
									<Link
										href="/changelog"
										className="block px-4 py-2 text-white/80 hover:text-white"
										onClick={onClose}
									>
										Changelog
									</Link>
								</div>
							</nav>

							<div className="p-4 border-t border-white/10">
								{user ? (
									<div className="space-y-3">
										<div className="flex items-center gap-3 px-2">
											<Avatar className="h-8 w-8">
												<AvatarImage
													src={user.image || ''}
													alt={user.name}
												/>
												<AvatarFallback className="bg-white/10 text-white">
													{user.name
														?.charAt(0)
														.toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1">
												<p className="text-sm font-medium text-white">
													{user.name}
												</p>
												<p className="text-xs text-white/60">
													{user.email}
												</p>
											</div>
										</div>
										<button
											onClick={() => {
												onSignOut()
												onClose()
											}}
											className="w-full px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-lg"
										>
											Sign out
										</button>
									</div>
								) : (
									<Link
										href="/sign-in"
										className="w-full px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center"
										onClick={onClose}
									>
										Sign in
									</Link>
								)}
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

const Header = () => {
	const [isScrolled, setIsScrolled] = useState(false)
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
	const [openDropdown, setOpenDropdown] = useState<string | null>(null)
	const [isSearchOpen, setIsSearchOpen] = useState(false)
	const { theme, setTheme } = useTheme()
	const { user, signOut } = useAuthHeader()

	React.useEffect(() => {
		const onScroll = () => {
			setIsScrolled(window.scrollY > 20)
		}

		window.addEventListener('scroll', onScroll, { passive: true })
		return () => window.removeEventListener('scroll', onScroll)
	}, [])

	const containerVariants = {
		initial: {
			width: '90%',
			y: 8,
			opacity: 1,
			left: '50%',
			x: '-50%'
		},
		scrolled: {
			width: '100vw',
			y: 0,
			opacity: 1,
			left: 0,
			x: 0
		}
	}

	const navVariants = {
		initial: {
			borderRadius: '1.5rem',
			backgroundColor: 'rgba(18, 18, 18, 0.1)',
			backdropFilter: 'blur(4px)',
			margin: '0 auto',
			boxShadow: '0 0 0 rgba(0, 0, 0, 0)'
		},
		scrolled: {
			borderRadius: '0',
			backgroundColor: 'rgba(18, 18, 18, 0.65)',
			backdropFilter: 'blur(8px)',
			margin: 0,
			boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
		}
	}

	return (
		<>
			<motion.div
				className="fixed top-0 left-0 right-0 z-40 flex justify-center"
				initial={false}
				animate={isScrolled ? 'scrolled' : 'initial'}
				variants={containerVariants}
				transition={{ duration: 0 }}
			>
				<motion.nav
					variants={navVariants}
					transition={{ duration: 0 }}
					className={`
                        flex items-center justify-between
                        px-6 h-[60px] w-full
                        border border-white/10
                        ${
							isScrolled
								? 'shadow-lg shadow-black/5 border-t-0'
								: 'max-w-7xl mx-auto mt-4'
						}
                    `}
				>
					{/* Logo */}
					<Link href="/" className="flex items-center">
						<div className="w-7 h-7 rounded-lg bg-white mr-6" />
					</Link>

					{/* Desktop Menu */}
					<div className="hidden lg:flex flex-1 items-center space-x-1">
						{MENU_ITEMS.map((item) => (
							<div key={item.label} className="relative">
								{item.dropdownItems ? (
									<button
										onClick={() =>
											setOpenDropdown(
												openDropdown === item.label
													? null
													: item.label
											)
										}
										className="flex items-center px-3 py-2 text-[14px] 
                      text-white/60 hover:text-white font-medium"
									>
										{item.label}
										<motion.div
											animate={{
												rotate:
													openDropdown === item.label
														? 180
														: 0
											}}
											className="ml-1 opacity-50"
										>
											<ChevronDown size={14} />
										</motion.div>
									</button>
								) : (
									<Link
										href={item.href}
										className="flex items-center px-3 py-2 text-[14px] 
                      text-white/60 hover:text-white font-medium"
									>
										{item.label}
										{item.isNew && (
											<span
												className="ml-2 px-1.5 py-0.5 text-[10px] 
                        font-medium text-white bg-white/10 
                        rounded border border-white/[0.15]"
											>
												New
											</span>
										)}
									</Link>
								)}

								{item.dropdownItems && (
									<DropdownMenu
										items={item.dropdownItems}
										isOpen={openDropdown === item.label}
									/>
								)}
							</div>
						))}
					</div>

					{/* Right Side */}
					<div className="flex items-center space-x-2">
						<button
							className="p-2 text-white/60 hover:text-white rounded-lg"
							onClick={() =>
								setTheme(theme === 'dark' ? 'light' : 'dark')
							}
						>
							{theme === 'dark' ? (
								<Moon size={18} />
							) : (
								<Sun size={18} />
							)}
						</button>
						<button
							className="p-2 text-white/60 hover:text-white rounded-lg"
							onClick={() => setIsSearchOpen(true)}
						>
							<Search size={18} />
						</button>

						{user ? (
							<div className="flex items-center gap-2">
								<Avatar className="h-8 w-8">
									<AvatarImage
										src={user.image || ''}
										alt={user.name}
									/>
									<AvatarFallback className="bg-white/10 text-white">
										{user.name?.charAt(0).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<button
									onClick={signOut}
									className="hidden sm:block px-4 py-1.5 text-sm font-medium text-white/70 hover:text-white"
								>
									Sign out
								</button>
							</div>
						) : (
							<Link
								href="/sign-in"
								className="hidden sm:block ml-2 px-5 py-1.5 text-sm font-medium text-white bg-white/10 hover:bg-white/[0.15] rounded-full"
							>
								Sign in
							</Link>
						)}

						<button
							className="lg:hidden p-2 text-white/60 hover:text-white"
							onClick={() => setIsMobileMenuOpen(true)}
						>
							<Menu size={24} />
						</button>
					</div>
				</motion.nav>
			</motion.div>

			{/* Mobile Menu */}
			<MobileMenu
				isOpen={isMobileMenuOpen}
				onClose={() => setIsMobileMenuOpen(false)}
				user={user}
				onSignOut={signOut}
			/>

			{/* Search Modal */}
			<SearchModal
				isOpen={isSearchOpen}
				onClose={() => setIsSearchOpen(false)}
			/>
		</>
	)
}

export default Header
