'use client';

import { cn } from '@/shared/utilities/cn';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const navigationItems = [
	{ name: 'Home', href: '/' },
	{ name: 'Features', href: '#features' },
	{ name: 'About', href: '#about' },
	{ name: 'Contact', href: '#contact' },
];

export function Navigation() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<header
			className={cn(
				'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
				isScrolled
					? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg'
					: 'bg-transparent'
			)}
		>
			<nav className="container mx-auto px-6 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<Link
							href="/"
							className="text-2xl font-bold bg-linear-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"
						>
							RYOA
						</Link>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-8">
						{navigationItems.map((item) => (
							<div key={item.name}>
								<Link
									href={item.href}
									className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
								>
									{item.name}
								</Link>
							</div>
						))}
						<button className="px-6 py-2 bg-linear-to-r from-purple-600 to-blue-500 text-white rounded-full font-medium hover:shadow-lg transition-shadow">
							Get Started
						</button>
					</div>

					{/* Mobile Menu Button */}
					<div className="md:hidden">
						<button
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
						>
							{isMobileMenuOpen ? (
								<X className="h-6 w-6" />
							) : (
								<Menu className="h-6 w-6" />
							)}
						</button>
					</div>
				</div>

				{/* Mobile Menu */}
				{isMobileMenuOpen && (
					<div className="md:hidden mt-4">
						<div className="flex flex-col space-y-4">
							{navigationItems.map((item) => (
								<div key={item.name} className="px-4">
									<Link
										href={item.href}
										className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors block py-2"
										onClick={() => setIsMobileMenuOpen(false)}
									>
										{item.name}
									</Link>
								</div>
							))}
							<button className="mx-4 px-6 py-2 bg-linear-to-r from-purple-600 to-blue-500 text-white rounded-full font-medium hover:shadow-lg transition-shadow">
								Get Started
							</button>
						</div>
					</div>
				)}
			</nav>
		</header>
	);
}
