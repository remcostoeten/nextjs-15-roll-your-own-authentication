'use client'

import { FeatureGrid } from '@/components/features/feature-grid'
import { motion } from 'framer-motion'
import { Github, Terminal } from 'lucide-react'
import Link from 'next/link'

export default function HomeClient() {
	return (
		<main className="min-h-screen">
			<div className="relative">
				<div className="absolute inset-0 -z-10">
					<div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/0" />
					<div className="absolute top-0 h-[500px] w-full animate-pulse">
						<div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent blur-2xl" />
						<div className="absolute inset-0 bg-gradient-radial from-accent/20 via-transparent to-transparent blur-2xl" />
					</div>
				</div>

				<div className="container px-4 py-32 mx-auto">
					<motion.div
						className="max-w-4xl mx-auto text-center"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<motion.div
							className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm rounded-full glass-card bg-white/5"
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
						>
							<Terminal className="w-4 h-4" />
							<span className="glow-text">
								Zero-dependency authentication for Next.js
							</span>
						</motion.div>

						<h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
							<span className="glow-text">Authentication.</span>
							<br />
							<span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
								Without the complexity.
							</span>
						</h1>

						<p className="text-xl text-muted-foreground mb-12">
							A lightweight, secure JWT authentication
							implementation
							<br />
							for Next.js applications without external
							dependencies.
						</p>

						<div className="flex flex-wrap gap-4 justify-center mb-16">
							<Link
								href="/docs"
								className="glass-card inline-flex h-12 items-center justify-center rounded-lg bg-primary/10 px-8 font-medium text-primary transition-colors hover:bg-primary/20"
							>
								Get Started
							</Link>
							<Link
								href="https://github.com/yourusername/jwt-auth"
								className="glass-card inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white/5 px-8 font-medium text-foreground transition-colors hover:bg-white/10"
							>
								<Github className="w-5 h-5" />
								<span>Star on GitHub</span>
							</Link>
						</div>

						<div className="mx-auto max-w-2xl overflow-hidden rounded-xl glass-card bg-white/5 backdrop-blur-sm">
							<div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
								<div className="flex gap-1.5">
									<div className="h-3 w-3 rounded-full bg-red-500" />
									<div className="h-3 w-3 rounded-full bg-yellow-500" />
									<div className="h-3 w-3 rounded-full bg-green-500" />
								</div>
								<div className="text-sm text-muted-foreground">
									terminal
								</div>
							</div>
							<div className="p-4">
								<motion.p
									className="font-mono text-primary"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.5 }}
								>
									$ npm install @jwt-auth/next
								</motion.p>
							</div>
						</div>
					</motion.div>
				</div>
			</div>

			<section className="py-32 relative">
				<div className="container px-4 mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-bold mb-4 glow-text">
							Everything you need
						</h2>
						<p className="text-muted-foreground">
							A complete authentication solution with all the
							features you need
						</p>
					</div>
					<FeatureGrid />
				</div>
			</section>
		</main>
	)
}
