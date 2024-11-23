'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'

type Props = {}

export default function NotFound({}: Props) {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
			<div className="text-center space-y-8 px-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="flex flex-col items-center"
				>
					<h1 className="text-9xl font-bold text-primary">404</h1>
					<div className="mt-4 text-xl text-muted-foreground">
						Page not found
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2, duration: 0.5 }}
					className="text-muted-foreground max-w-lg mx-auto"
				>
					The page you're looking for doesn't exist or has been moved.
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4, duration: 0.5 }}
					className="flex gap-4 justify-center"
				>
					<Link
						href="/"
						className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
					>
						<Home className="w-4 h-4 mr-2" />
						Home
					</Link>
					<button
						onClick={() => window.history.back()}
						className="inline-flex items-center justify-center px-5 py-2 border border-primary text-base font-medium rounded-md text-primary hover:bg-primary/10 transition-colors"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Go Back
					</button>
				</motion.div>
			</div>
		</div>
	)
}
