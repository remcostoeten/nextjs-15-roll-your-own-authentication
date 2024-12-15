'use client'

import { Logo } from '@/components/theme/logo'
import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import AuthQuote from './quote'

type AuthLayoutProps = {
	children: ReactNode
	title: string
	subtitle: ReactNode
}

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.05,
			delayChildren: 0.01
		}
	}
}

const fadeInUp = {
	hidden: { opacity: 0, y: 5 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			type: "spring",
			duration: 0.2,
			bounce: 0
		}
	}
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
	return (
		<div className="flex min-h-screen flex-col bg-[#1C1C1C] text-white">
			<header className="flex items-center px-6 py-4">
				<Logo className="h-6" />
				<div className="ml-auto">
					<a href="#" className="text-sm text-neutral-400 hover:text-white">Documentation</a>
				</div>
			</header>

			<div className="flex flex-1">
				<main className="flex w-full flex-col items-center justify-center px-5 lg:w-1/2">
					<motion.div 
						className="w-full max-w-[400px] space-y-4"
						variants={container}
						initial="hidden"
						animate="show"
					>
						<div className="space-y-2">
							<motion.h1 
								variants={fadeInUp}
								className="text-2xl font-medium"
							>
								{title}
							</motion.h1>
							
							<motion.p 
								variants={fadeInUp}
								className="text-sm text-neutral-400"
							>
								{subtitle}
							</motion.p>
						</div>

						<motion.div 
							variants={fadeInUp}
							className="space-y-4"
						>
							<button className="flex h-10 w-full items-center justify-center gap-2 rounded bg-[#2D2D2D] px-4 text-sm font-medium hover:bg-[#343434]">
								<svg className="h-5 w-5" viewBox="0 0 24 24" fill="white">
									<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
								</svg>
								Continue with GitHub
							</button>

							<button className="flex h-10 w-full items-center justify-center gap-2 rounded bg-[#2D2D2D] px-4 text-sm font-medium hover:bg-[#343434]">
								<svg className="h-5 w-5" viewBox="0 0 24 24" fill="white">
									<path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm0 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2zm0 3c-2.8 0-5 2.2-5 5v3h2v-3c0-1.7 1.3-3 3-3s3 1.3 3 3v3h2v-3c0-2.8-2.2-5-5-5z"/>
								</svg>
								Continue with SSO
							</button>

							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-t border-[#2D2D2D]" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-[#1C1C1C] px-2 text-neutral-400">or</span>
								</div>
							</div>

							{children}
						</motion.div>
					</motion.div>
				</main>

				<AuthQuote />
			</div>

			<footer className="px-6 py-4 text-center text-xs text-neutral-400">
				<p>
					By continuing, you agree to Supabase's{' '}
					<a href="#" className="underline hover:text-white">Terms of Service</a>{' '}
					and{' '}
					<a href="#" className="underline hover:text-white">Privacy Policy</a>,
					and to receive periodic emails with updates.
				</p>
			</footer>
		</div>
	)
}