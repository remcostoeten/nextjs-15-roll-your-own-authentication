'use client'

import { useState, useEffect, useRef } from 'react'
import { Github, Menu, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { navItems } from '@/core/config/navigation'
import { HackerMenuItem } from '../components/hacker-menu-item'
import { LoginButton } from './login-button'
import { Logo } from './logo'
import Link from 'next/link'
import { useKeyboardShortcuts } from '../../../hooks/use-keyboard-shortcuts'

// Demo menu items
const demoItems = [
	{
		name: 'JWT Authentication',
		href: '/demos/jwt',
		description: 'Implement secure JWT tokens without dependencies',
	},
	{
		name: 'OAuth Integration',
		href: '/demos/oauth',
		description: 'Build your own OAuth provider connections',
	},
	{
		name: 'Password Hashing',
		href: '/demos/password',
		description: 'Secure password storage with PBKDF2',
	},
	{
		name: 'Feature Flags',
		href: '/demos/feature-flags',
		description: 'Build your own feature flag system',
		soon: true,
	},
	{
		name: 'Role-Based Access',
		href: '/demos/rbac',
		description: 'Implement RBAC with protected routes',
		soon: true,
	},
]

export function Header() {
	const pathname = usePathname()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isMobile, setIsMobile] = useState(false)
	const [scrolled, setScrolled] = useState(false)
	const headerRef = useRef<HTMLElement>(null)

	// Check if we're on mobile
	useEffect(() => {
		const checkIfMobile = () => {
			setIsMobile(window.innerWidth < 768)
		}

		// Initial check
		checkIfMobile()

		// Add event listener
		window.addEventListener('resize', checkIfMobile)

		// Cleanup
		return () => window.removeEventListener('resize', checkIfMobile)
	}, [])

	// Handle scroll effects
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 20) {
				setScrolled(true)
			} else {
				setScrolled(false)
			}
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	// Close menu when route changes
	useEffect(() => {
		setIsMenuOpen(false)
	}, [pathname])

	// Prevent scrolling when mobile menu is open
	useEffect(() => {
		if (isMenuOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'unset'
		}

		return () => {
			document.body.style.overflow = 'unset'
		}
	}, [isMenuOpen])

	useKeyboardShortcuts()

	// Define animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.08,
				delayChildren: 0.2,
			},
		},
	}

	const itemVariants = {
		hidden: { opacity: 0, y: -10 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: 'spring',
				damping: 12,
				stiffness: 100,
			},
		},
	}

	const mobileMenuVariants = {
		hidden: { opacity: 0, x: '100%' },
		visible: {
			opacity: 1,
			x: 0,
			transition: {
				type: 'spring',
				damping: 25,
				stiffness: 200,
			},
		},
		exit: {
			opacity: 0,
			x: '100%',
			transition: {
				type: 'spring',
				damping: 25,
				stiffness: 200,
			},
		},
	}

	return (
		<motion.header
			ref={headerRef}
			className={`fixed top-0 z-50 w-full h-16 border-b transition-all duration-300 overflow-visible ${
				scrolled
					? 'border-[#4e9815]/30 bg-[#0D0C0C]/90 backdrop-blur-md'
					: 'border-[#1E1E1E] bg-[#0D0C0C]/80 backdrop-blur-sm'
			}`}
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ type: 'spring', stiffness: 300, damping: 30 }}
		>
			{/* Matrix code rain effect that appears on scroll */}
			<div
				className={`absolute inset-0 overflow-hidden transition-opacity duration-500 ${scrolled ? 'opacity-5' : 'opacity-0'}`}
				style={{
					backgroundImage:
						"url(\"data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='matrix' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Ctext x='0' y='15' fontFamily='monospace' fontSize='15' fill='%230f0' opacity='0.3'%3E0%3C/text%3E%3Ctext x='10' y='10' fontFamily='monospace' fontSize='10' fill='%230f0' opacity='0.3'%3E1%3C/text%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23matrix)'/%3E%3C/svg%3E\")",
					backgroundSize: '50px 50px',
					animation: 'matrix-rain 20s linear infinite',
				}}
			/>

			<div className="flex h-16 items-center justify-between px-6 overflow-visible header-inner-container">
				<Logo />

				{/* Desktop Navigation */}
				<motion.nav
					className="hidden md:flex items-center gap-8 overflow-visible"
					variants={containerVariants}
					initial="hidden"
					animate="visible"
				>
					{navItems.map((item) => (
						<motion.div
							key={item.name}
							variants={itemVariants}
							className="flex items-center justify-center"
						>
							<HackerMenuItem
								href={item.href}
								text={item.name}
								isActive={pathname === item.href}
							/>
						</motion.div>
					))}

					{/* Add Demos dropdown menu with animated chevron */}
					<motion.div
						variants={itemVariants}
						className="flex items-center justify-center"
					>
						<div className="relative group">
							<div className="flex items-center gap-1 text-[#8C877D] hover:text-white transition-colors duration-200 cursor-pointer">
								<span className="font-mono">_demos</span>
								<motion.div
									initial={{ rotate: 0 }}
									className="inline-flex items-center justify-center w-4 h-4 transition-colors duration-200 group-hover:text-[#4e9815]"
								>
									<ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
								</motion.div>
							</div>

							<div className="absolute left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-[-8px] group-hover:translate-y-0 z-50">
								<div className="rounded-md border border-[#1E1E1E] bg-[#0D0C0C]/95 backdrop-blur-md shadow-lg overflow-hidden">
									{/* Matrix code background */}
									<div
										className="absolute inset-0 opacity-5 rounded-md overflow-hidden"
										style={{
											backgroundImage:
												"url(\"data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='matrix' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Ctext x='0' y='15' fontFamily='monospace' fontSize='15' fill='%230f0' opacity='0.3'%3E0%3C/text%3E%3Ctext x='10' y='10' fontFamily='monospace' fontSize='10' fill='%230f0' opacity='0.3'%3E1%3C/text%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23matrix)'/%3E%3C/svg%3E\")",
											backgroundSize: '50px 50px',
										}}
									/>

									<div className="relative z-10 py-1">
										{demoItems.map((item) => (
											<Link
												key={item.name}
												href={item.href}
												className="block px-4 py-2 text-sm text-[#8C877D] hover:text-white hover:bg-[#1E1E1E] transition-colors duration-200"
											>
												<div className="font-medium flex items-center justify-between">
													{item.name}
													{item.soon && (
														<span className="text-xs px-1.5 py-0.5 rounded bg-[#1E1E1E] text-[#8C877D] border border-[#2D2D2D]">
															Soon
														</span>
													)}
												</div>
												{item.description && (
													<div className="text-xs text-[#8C877D] mt-0.5">
														{item.description}
													</div>
												)}
											</Link>
										))}
									</div>
								</div>
							</div>
						</div>
					</motion.div>

					<motion.div variants={itemVariants}>
						<a
							href="https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication"
							target="_blank"
							rel="noopener noreferrer"
							className="relative group flex items-center justify-center"
						>
							<Github className="h-5 w-5 text-[#8C877D] group-hover:text-white transition-colors duration-200" />

							{/* Glow effect on hover */}
							<span className="absolute -inset-2 bg-[#4e9815] rounded-full blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
						</a>
					</motion.div>

					<motion.div variants={itemVariants}>
						<LoginButton />
					</motion.div>
				</motion.nav>

				{/* Mobile Menu Button */}
				<div className="md:hidden">
					<motion.button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="p-2 text-[#8C877D] hover:text-white transition-colors relative"
						aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
						whileTap={{ scale: 0.9 }}
					>
						<AnimatePresence mode="wait">
							{isMenuOpen ? (
								<motion.div
									key="close"
									initial={{ rotate: -90, opacity: 0 }}
									animate={{ rotate: 0, opacity: 1 }}
									exit={{ rotate: 90, opacity: 0 }}
									transition={{ duration: 0.2 }}
								>
									<X size={24} />
								</motion.div>
							) : (
								<motion.div
									key="menu"
									initial={{ rotate: 90, opacity: 0 }}
									animate={{ rotate: 0, opacity: 1 }}
									exit={{ rotate: -90, opacity: 0 }}
									transition={{ duration: 0.2 }}
								>
									<Menu size={24} />
								</motion.div>
							)}
						</AnimatePresence>

						{/* Glow effect */}
						<span
							className={`absolute inset-0 bg-[#4e9815] rounded-full blur transition-opacity duration-300 ${isMenuOpen ? 'opacity-20' : 'opacity-0'}`}
						></span>
					</motion.button>
				</div>
			</div>

			{/* Mobile Menu */}
			<AnimatePresence>
				{isMenuOpen && (
					<motion.div
						className="fixed inset-0 top-16 z-40 bg-[#0D0C0C]/95 backdrop-blur-md md:hidden"
						variants={mobileMenuVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
					>
						{/* Matrix code background */}
						<div
							className="absolute inset-0 opacity-5"
							style={{
								backgroundImage:
									"url(\"data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='matrix' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Ctext x='0' y='15' fontFamily='monospace' fontSize='15' fill='%230f0' opacity='0.3'%3E0%3C/text%3E%3Ctext x='10' y='10' fontFamily='monospace' fontSize='10' fill='%230f0' opacity='0.3'%3E1%3C/text%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23matrix)'/%3E%3C/svg%3E\")",
								backgroundSize: '50px 50px',
								animation: 'matrix-rain 20s linear infinite',
							}}
						/>

						<div className="flex flex-col items-center justify-center h-full relative z-10">
							<nav className="flex flex-col items-center gap-8 py-8">
								{navItems.map((item, index) => (
									<motion.div
										key={item.name}
										className="flex items-center justify-center"
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: index * 0.1, duration: 0.3 }}
									>
										<HackerMenuItem
											href={item.href}
											text={item.name}
											isActive={pathname === item.href}
										/>
									</motion.div>
								))}

								{/* Add Demos dropdown for mobile */}
								<motion.div
									className="flex items-center justify-center"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: navItems.length * 0.1, duration: 0.3 }}
								>
									<div className="flex flex-col items-center">
										<div className="text-[#4e9815] mb-2 font-mono">_demos</div>
										<div className="flex flex-col gap-2">
											{demoItems.map((item, idx) => (
												<Link
													key={item.name}
													href={item.href}
													className="text-[#8C877D] hover:text-white transition-colors text-sm text-center"
													onClick={() => setIsMenuOpen(false)}
												>
													{item.name}
												</Link>
											))}
										</div>
									</div>
								</motion.div>

								<motion.a
									href="https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center justify-center mt-4 relative group"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: (navItems.length + 1) * 0.1, duration: 0.3 }}
								>
									<Github className="h-6 w-6 text-[#8C877D] group-hover:text-white transition-colors duration-200" />

									{/* Glow effect */}
									<span className="absolute -inset-4 bg-[#4e9815] rounded-full blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
								</motion.a>

								<motion.div
									className="mt-6"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: (navItems.length + 2) * 0.1, duration: 0.3 }}
								>
									<LoginButton />
								</motion.div>
							</nav>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.header>
	)
}
