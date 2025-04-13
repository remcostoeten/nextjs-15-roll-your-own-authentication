'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search, Menu, X, ChevronDown, Plus } from 'lucide-react'

export function MobileNavigationBar() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

	return (
		<div
			className="h-14 w-full flex flex-row md:hidden"
			data-sentry-component="MobileNavigationBar"
			data-sentry-source-file="MobileNavigationBar.tsx"
		>
			<nav className="group px-4 z-10 w-full h-14 border-b bg-[#1E1E1E] border-[#2E2E2E] shadow-xl transition-width duration-200 hide-scrollbar flex flex-row items-center justify-between overflow-x-auto">
				<Link
					className="flex items-center h-[26px] w-[26px] min-w-[26px]"
					href="/dashboard/projects"
				>
					<img
						alt="Supabase"
						src="/dashboard/img/supabase-logo.svg"
						className="absolute h-[26px] w-[26px] cursor-pointer rounded"
					/>
				</Link>
				<div className="flex gap-2">
					<button
						className="whitespace-nowrap border border-[#3E3E3E] text-sm font-medium hover:bg-[#2E2E2E] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group flex-grow h-[30px] rounded-md p-2 flex items-center justify-between bg-transparent border-none text-gray-400 hover:bg-opacity-100 hover:border-[#4E4E4E] hover:text-gray-300 focus-visible:!outline-4 focus-visible:outline-offset-1 focus-visible:outline-emerald-600 transition"
						aria-haspopup="dialog"
						aria-expanded="false"
						aria-controls="command-menu-dialog-content"
					>
						<div className="flex items-center space-x-2">
							<Search
								width={18}
								height={18}
								className="lucide lucide-search"
							/>
						</div>
					</button>
					<button
						title="Menu dropdown button"
						className={`relative justify-center cursor-pointer items-center space-x-2 text-center font-regular ease-out duration-200 outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border dark:bg-[#2E2E2E] hover:bg-[#3E3E3E] hover:border-[#4E4E4E] focus-visible:outline-emerald-600 data-[state=open]:outline-emerald-600 data-[state=open]:border-[#4E4E4E] flex lg:hidden border-[#3E3E3E] bg-[#1E1E1E]/75 text-gray-400 rounded-md min-w-[30px] w-[30px] h-[30px] ${mobileMenuOpen ? 'bg-[#3E3E3E]/30' : ''}`}
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					>
						{mobileMenuOpen ? (
							<X
								width={18}
								height={18}
								className="m-auto"
							/>
						) : (
							<Menu
								width={18}
								height={18}
								className="m-auto"
							/>
						)}
					</button>
				</div>
			</nav>

			{/* Mobile Menu Dropdown */}
			{mobileMenuOpen && (
				<div className="fixed inset-0 z-50 bg-[#1E1E1E] pt-14 animate-in fade-in slide-in-from-top-5 duration-200">
					<div className="p-4">
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-2">
								<div className="bg-emerald-500 text-white p-1 rounded-md">
									<svg
										width="14"
										height="14"
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
								<div className="flex items-center gap-1">
									<span className="text-sm text-white">
										remcostoeten's Org
									</span>
									<ChevronDown
										size={14}
										className="text-gray-400"
									/>
								</div>
							</div>
							<button className="text-xs text-white bg-emerald-600 px-2 py-1 rounded-md flex items-center gap-1">
								<Plus size={12} />
								<span>New project</span>
							</button>
						</div>

						<div className="space-y-4">
							<div>
								<h3 className="text-xs uppercase text-gray-400 mb-2">
									Projects
								</h3>
								<ul className="space-y-1">
									<li>
										<a
											href="/"
											className="block px-2 py-1.5 text-sm text-white hover:bg-[#2E2E2E] rounded-md"
										>
											Dashboard
										</a>
									</li>
								</ul>
							</div>

							<div>
								<h3 className="text-xs uppercase text-gray-400 mb-2">
									Account
								</h3>
								<ul className="space-y-1">
									<li>
										<a
											href="#"
											className="block px-2 py-1.5 text-sm text-white hover:bg-[#2E2E2E] rounded-md"
										>
											Preferences
										</a>
									</li>
									<li>
										<a
											href="#"
											className="block px-2 py-1.5 text-sm text-white hover:bg-[#2E2E2E] rounded-md"
										>
											Access Tokens
										</a>
									</li>
									<li>
										<a
											href="#"
											className="block px-2 py-1.5 text-sm text-white hover:bg-[#2E2E2E] rounded-md"
										>
											Log out
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
