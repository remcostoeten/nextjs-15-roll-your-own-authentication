'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Github, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { navItems } from '@/core/config/navigation'
import { HackerMenuItem } from './hacker-menu-item'

export function Header() {
	const pathname = usePathname()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isMobile, setIsMobile] = useState(false)

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

	const logoVariants = {
		hidden: { opacity: 0, scale: 0.95 },
		visible: {
			opacity: 1,
			scale: 1,
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
		<header className="fixed top-0 z-50 w-full border-b border-[#1E1E1E] bg-[#0D0C0C]/80 backdrop-blur-sm">
			<div className="flex h-14 items-center justify-between px-6">
				<motion.div
					variants={logoVariants}
					initial="hidden"
					animate="visible"
				>
					<Link
						href="/"
						className="flex items-center gap-2"
					>
						<div className="h-5 w-5 rounded bg-white" />
						<span className="bg-gradient-to-b from-[#F2F0ED] to-[#ADADAD] bg-clip-text text-transparent font-semibold">
							ROLL-YOUR-OWN-AUTH
						</span>
					</Link>
				</motion.div>

				{/* Desktop Navigation */}
				<motion.nav
					className="hidden md:flex items-center gap-8"
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

					<motion.div variants={itemVariants}>
						<a
							href="https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-center"
						>
							<Github className="h-5 w-5 text-[#8C877D] hover:text-white transition-colors duration-200" />
						</a>
					</motion.div>

					<motion.div variants={itemVariants}>
						<Link
							href="/login"
							className="flex items-center gap-2 px-4 py-1.5 rounded-md border border-[#4e9815]/30 bg-[#4e9815]/10 text-[#4e9815] hover:bg-[#4e9815]/20 transition-all duration-200"
						>
							<span>Login</span>
							<span className="text-xs opacity-70 font-mono">[ctrl+l]</span>
						</Link>
					</motion.div>
				</motion.nav>

				{/* Mobile Menu Button */}
				<div className="md:hidden">
					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="p-2 text-[#8C877D] hover:text-white transition-colors"
						aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
					>
						{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
				</div>
			</div>

			{/* Mobile Menu */}
			<AnimatePresence>
				{isMenuOpen && (
					<motion.div
						className="fixed inset-0 top-14 z-40 bg-[#0D0C0C]/95 backdrop-blur-md md:hidden"
						variants={mobileMenuVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
					>
						<div className="flex flex-col items-center justify-center h-full">
							<nav className="flex flex-col items-center gap-8 py-8">
								{navItems.map((item) => (
									<div
										key={item.name}
										className="flex items-center justify-center"
									>
										<HackerMenuItem
											href={item.href}
											text={item.name}
											isActive={pathname === item.href}
										/>
									</div>
								))}

								<a
									href="https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center justify-center mt-4"
								>
									<Github className="h-6 w-6 text-[#8C877D] hover:text-white transition-colors duration-200" />
								</a>

								<Link
									href="/login"
									className="flex items-center gap-2 px-6 py-2 mt-6 rounded-md border border-[#4e9815]/30 bg-[#4e9815]/10 text-[#4e9815] hover:bg-[#4e9815]/20 transition-all duration-200"
								>
									<span>Login</span>
									<span className="text-xs opacity-70 font-mono">[ctrl+l]</span>
								</Link>
							</nav>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	)
}
