'use client'

import { LoginForm } from '@/components/auth'
import { motion } from 'framer-motion'
import Image from 'next/image'

const formVariants = {
	hidden: { opacity: 0, x: 20 },
	visible: {
		opacity: 1,
		x: 0,
		transition: {
			duration: 0.5,
			ease: 'easeOut',
			staggerChildren: 0.1
		}
	}
}

const itemVariants = {
	hidden: { opacity: 0, y: 10 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.3 }
	}
}

export default function LoginPage() {
	return (
		<div className="flex min-h-screen">
			{/* Left side - Image */}
			<div className="hidden lg:flex lg:w-1/2 relative">
				<Image
					src="/images/auth-bg.jpg"
					alt="Authentication background"
					fill
					className="object-cover"
					priority
				/>
				<div className="absolute inset-0 bg-black/50" />
				<div className="absolute inset-0 flex items-center justify-center p-8">
					<div className="max-w-md text-center">
						<h1 className="text-3xl font-bold text-white mb-4">
							Welcome Back!
						</h1>
						<p className="text-lg text-gray-200">
							Sign in to continue your journey with us.
						</p>
					</div>
				</div>
			</div>

			{/* Right side - Form */}
			<motion.div
				className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto"
				variants={formVariants}
				initial="hidden"
				animate="visible"
			>
				<div className="w-full max-w-md space-y-6">
					<motion.div
						className="text-center space-y-1.5"
						variants={itemVariants}
					>
						<h2 className="text-2xl font-semibold text-white">
							Sign In Account
						</h2>
						<p className="text-[0.9375rem] text-gray-400">
							Enter your credentials to access your account.
						</p>
					</motion.div>
					<motion.div variants={itemVariants}>
						<LoginForm />
					</motion.div>
				</div>
			</motion.div>
		</div>
	)
}
