import React from 'react'
import Link from 'next/link'

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="min-h-screen bg-[#0a0a0a]">
			{/* Header */}
			<header className="w-full py-5 border-b border-gray-800">
				<div className="container mx-auto px-6 flex justify-between items-center">
					<Link
						href="/"
						className="flex items-center"
					>
						<div className="h-8 w-8 bg-[#2E71E5] rounded-full flex items-center justify-center">
							<span className="text-white font-bold">R</span>
						</div>
						<span className="ml-2 text-lg font-semibold text-white">
							Raioa
						</span>
					</Link>
					<nav>
						<ul className="flex space-x-6">
							<li>
								<Link
									href="/"
									className="text-sm text-gray-400 hover:text-white transition-colors"
								>
									Home
								</Link>
							</li>
							<li>
								<Link
									href="/docs"
									className="text-sm text-gray-400 hover:text-white transition-colors"
								>
									Documentation
								</Link>
							</li>
							<li>
								<Link
									href="/login"
									className="text-sm text-gray-400 hover:text-white transition-colors"
								>
									Login
								</Link>
							</li>
						</ul>
					</nav>
				</div>
			</header>

			{/* Main content */}
			<main className="flex-grow flex items-center justify-center">
				{children}
			</main>

			{/* Footer */}
			<footer className="py-6 border-t border-gray-800">
				<div className="container mx-auto px-6 flex flex-col sm:flex-row justify-between items-center text-sm">
					<div className="mb-4 sm:mb-0 text-gray-400">
						&copy; {new Date().getFullYear()} Raioa, Inc. All rights
						reserved.
					</div>
					<div className="flex space-x-6">
						<Link
							href="/privacy"
							className="text-gray-400 hover:text-white transition-colors"
						>
							Privacy
						</Link>
						<Link
							href="/terms"
							className="text-gray-400 hover:text-white transition-colors"
						>
							Terms
						</Link>
						<Link
							href="/contact"
							className="text-gray-400 hover:text-white transition-colors"
						>
							Contact
						</Link>
					</div>
				</div>
			</footer>
		</div>
	)
}
