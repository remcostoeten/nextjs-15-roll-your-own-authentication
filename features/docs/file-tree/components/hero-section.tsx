// src/features/docs/components/hero-section.tsx
'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export function HeroSection() {
	return (
		<section className="relative">
			{/* Background Pattern */}
			<div className="absolute inset-0 -z-10 overflow-hidden">
				<motion.div
					className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
					initial={{ opacity: 0 }}
					animate={{ opacity: 0.5 }}
					transition={{ duration: 1 }}
				/>
			</div>

			<div className="relative z-10 max-w-4xl mx-auto py-24 px-4">
				<div className="space-y-6 text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<h1 className="text-5xl font-bold tracking-tight">
							FileTree
						</h1>
						<p className="mt-4 text-xl text-zinc-400">
							A powerful, customizable, and accessible file tree
							component for React applications
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="flex items-center justify-center space-x-4"
					>
						<Button size="lg">Get Started</Button>
						<Button size="lg" variant="outline">
							View on GitHub
						</Button>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
						className="flex items-center justify-center flex-wrap gap-2"
					>
						<Badge variant="secondary">React</Badge>
						<Badge variant="secondary">TypeScript</Badge>
						<Badge variant="secondary">Accessible</Badge>
						<Badge variant="secondary">Customizable</Badge>
					</motion.div>
				</div>
			</div>
		</section>
	)
}
