import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { navItems } from '../config/nav-items'
import { LoginButton } from '@/modules/authentication/components/login-button'

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

interface MobileNavProps {
	isOpen: boolean
	onToggle: () => void
}

export function MobileNav({ isOpen, onToggle }: MobileNavProps) {
	const pathname = usePathname()
	const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
	const menuItems = navItems

	return (
		<>
			<button
				onClick={onToggle}
				className="md:hidden p-2 text-[#8C877D] hover:text-white transition-colors relative group"
				aria-label={isOpen ? 'Close menu' : 'Open menu'}
			>
				<div className="absolute inset-0 rounded-full bg-[#4e9815]/0 group-hover:bg-[#4e9815]/10 transition-colors duration-300"></div>
				{isOpen ? <X size={24} /> : <Menu size={24} />}
			</button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						className="fixed inset-0 top-14 z-40 bg-[#0D0C0C]/95 backdrop-blur-md md:hidden"
						variants={mobileMenuVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
					>
						<div className="flex flex-col items-center justify-center h-full">
							<nav className="flex flex-col items-center gap-8 py-8 w-full max-w-sm mx-auto">
								{menuItems.map((item) => (
									<div
										key={item.name}
										className="flex flex-col items-center w-full"
									>
										{item.isDropdown ? (
											<>
												<button
													onClick={() =>
														setActiveDropdown(
															activeDropdown ===
																item.name
																? null
																: item.name
														)
													}
													className="flex items-center gap-2 text-[#8C877D] hover:text-white transition-colors duration-200 py-2"
												>
													{item.icon}
													<span className="font-mono">
														{item.name}
													</span>
												</button>

												<AnimatePresence>
													{activeDropdown ===
														item.name && (
														<motion.div
															initial={{
																height: 0,
																opacity: 0,
															}}
															animate={{
																height: 'auto',
																opacity: 1,
															}}
															exit={{
																height: 0,
																opacity: 0,
															}}
															transition={{
																duration: 0.3,
															}}
															className="overflow-hidden mt-2 w-full border border-[#1E1E1E] rounded-md"
														>
															<div className="flex flex-col items-start gap-1 py-2 bg-[#0D0C0C]/80">
																{item.items?.map(
																	(
																		subItem
																	) => (
																		<Link
																			key={
																				subItem.name
																			}
																			href={
																				subItem.href
																			}
																			className={`text-sm w-full px-4 py-3 flex items-center gap-2 ${
																				pathname ===
																				subItem.href
																					? 'text-white bg-[#1E1E1E]'
																					: 'text-[#8C877D] hover:text-white hover:bg-[#1E1E1E]/50'
																			} transition-colors duration-200`}
																			onClick={
																				onToggle
																			}
																		>
																			{
																				subItem.icon
																			}
																			<div>
																				<div className="font-mono">
																					{
																						subItem.name
																					}
																				</div>
																				<div className="text-xs text-[#8C877D]">
																					{
																						subItem.description
																					}
																				</div>
																			</div>
																		</Link>
																	)
																)}
															</div>
														</motion.div>
													)}
												</AnimatePresence>
											</>
										) : (
											<Link
												href={item.href}
												className={`flex items-center gap-2 py-2 ${
													pathname === item.href
														? 'text-white'
														: 'text-[#8C877D] hover:text-white'
												} transition-colors duration-200`}
												onClick={onToggle}
											>
												{item.icon}
												<span className="font-mono">
													{item.name}
												</span>
											</Link>
										)}
									</div>
								))}

								<div className="w-full border-t border-[#1E1E1E] my-4"></div>

								<LoginButton />
							</nav>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	)
}
