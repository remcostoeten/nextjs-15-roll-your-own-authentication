'use client'

import { privateNavItems, publicNavItems } from '@/core/config/navigation-items'
import { signOut } from '@/features/auth/actions/auth'
import { useAuthState } from '@/features/auth/hooks/use-auth-state'
import useKeyboardShortcuts from '@/hooks/use-keyboard-shortcut'
import Link from 'next/link'
import { useState } from 'react'
import Logo from './logo'

export default function Header() {
	const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
	const { isAuthenticated } = useAuthState({ isAuthenticated: false })

	const navItems = isAuthenticated ? privateNavItems : publicNavItems

	const shortcuts = navItems
		.filter((item) => item.shortcut)
		.map((item) => ({
			key: item.shortcut!,
			href: item.href
		}))

	useKeyboardShortcuts({ shortcuts })

	const handleSignOut = async (e: React.MouseEvent<HTMLAnchorElement>) => {
		if (e.currentTarget.textContent === 'Sign out') {
			e.preventDefault()
			await signOut()
		}
	}

	return (
		<header
			className="fixed inset-x-0 top-4 z-[100] mx-auto w-[calc(100vw-32px)] max-w-[1048px] isolate 
                 overflow-visible rounded-2xl px-3 
                 bg-black/40 backdrop-blur-xl 
                 shadow-[0_0_0_1px_rgba(255,255,255,0.1)] 
                 transition-all duration-200 ease-out select-none min-h-[64px]"
		>
			<nav className="w-full h-full" aria-label="Main">
				<div className="relative h-full">
					<ul className="flex items-center justify-between h-[64px] list-none m-0 px-2">
						{/* Logo */}
						<li className="flex items-center h-full">
							<Link
								href="/"
								className="flex items-center h-full px-2 text-white transition-colors"
							>
								<Logo fill="white" />
							</Link>
						</li>

						<div className="flex items-center h-full gap-3">
							{navItems.map((item, i) => {
								if (item.dropdown) {
									return (
										<li
											key={i}
											className="relative h-full flex items-center"
										>
											<button
												onClick={() =>
													setActiveDropdown(
														activeDropdown ===
															item.label
															? null
															: item.label
													)
												}
												className="flex items-center h-8 px-3 text-white/90 hover:text-white 
                                 transition-colors gap-1.5 rounded-lg hover:bg-white/[0.06]"
											>
												{item.label}
												<svg
													className={`w-4 h-4 transition-transform duration-200 ${
														activeDropdown ===
														item.label
															? 'rotate-180'
															: ''
													}`}
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M19 9l-7 7-7-7"
													/>
												</svg>
											</button>
											<div
												className={`
                          absolute top-[calc(100%-4px)] left-0 
                          perspective-[1000px]
                          ${activeDropdown === item.label ? 'visible' : 'invisible'}
                        `}
											>
												<div
													className={`
                          w-48 p-1 rounded-lg
                          bg-black/95 backdrop-blur-xl
                          shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_10px_40px_-10px_rgba(0,0,0,0.5)]
                          origin-[top_center] 
                          transition-[transform,opacity] duration-200
                          ${
								activeDropdown === item.label
									? 'opacity-100 rotate-x-0 translate-y-0'
									: 'opacity-0 rotate-x-[-20deg] -translate-y-2'
							}
                        `}
												>
													{item.dropdown.map(
														(dropdownItem, j) => (
															<Link
																key={j}
																href={
																	dropdownItem.href
																}
																className="block px-2 py-1.5 text-sm text-white/75 
                                       rounded-md hover:text-white hover:bg-white/[0.06] 
                                       transition-colors"
															>
																{
																	dropdownItem.label
																}
															</Link>
														)
													)}
												</div>
											</div>
										</li>
									)
								}

								if (item.button && item.label === 'Sign out') {
									return (
										<li key={i}>
											<button
												onClick={async (e) => {
													e.preventDefault()
													await signOut()
												}}
												className={`
                          inline-flex items-center justify-center whitespace-nowrap select-none
                          max-w-full flex-shrink-0 font-medium text-[13px] h-8
                          rounded-lg transition-all duration-150 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
                          ${
								item.buttonStyle === 'secondary'
									? 'bg-[#28282c] text-white hover:brightness-125 px-3'
									: 'hover:bg-gray-100 px-3'
							}
                        `}
											>
												{item.label}
											</button>
										</li>
									)
								}

								return (
									<li key={i}>
										<Link
											href={item.href}
											onClick={handleSignOut}
											className={`
                          inline-flex items-center justify-center whitespace-nowrap select-none
                          max-w-full flex-shrink-0 font-medium text-[13px] h-8
                          rounded-lg transition-all duration-150 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
                          ${
								item.buttonStyle === 'secondary'
									? 'bg-[#28282c] text-white hover:brightness-125 px-3'
									: 'hover:bg-gray-100 px-3'
							}
                        `}
										>
											{item.label}
										</Link>
									</li>
								)
							})}
						</div>
					</ul>
				</div>
			</nav>
		</header>
	)
}
