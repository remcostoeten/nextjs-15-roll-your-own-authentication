'use client'

import { RegisterForm } from '@/components/auth/auth-form'
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

export default function RegisterPage() {
	return (
		<div className="flex h-screen max-h-[100vh] w-full overflow-hidden">
			<div className="relative hidden w-1/2 lg:block">
				<div className="absolute inset-6 rounded-[32px] overflow-hidden bg-[#10412F]">
					<Image
						src="/gradients/green-gradient.svg"
						alt="Decorative gradient"
						fill
						priority
						className="object-cover opacity-90"
					/>
					<div className="absolute inset-0 flex flex-col justify-center px-16">
						<div className="mb-16">
							<div className="flex items-center gap-2 mb-16">
								<div className="w-6 h-6 rounded-full bg-white" />
								<span className="text-lg font-medium text-white">
									OnlyPipe
								</span>
							</div>
							<h1 className="text-[2.75rem] font-semibold text-white mb-4">
								Get Started with Us
							</h1>
							<p className="text-lg text-gray-300">
								Complete these easy steps to register your
								account.
							</p>
						</div>
						<div className="space-y-3">
							<div className="flex items-center gap-3 px-6 py-4 bg-white bg-opacity-10 rounded-xl">
								<span className="flex items-center justify-center w-6 h-6 text-sm font-medium text-white bg-white bg-opacity-20 rounded-full">
									1
								</span>
								<span className="text-white">
									Sign up your account
								</span>
							</div>
							<div className="flex items-center gap-3 px-6 py-4 bg-white bg-opacity-5 rounded-xl">
								<span className="flex items-center justify-center w-6 h-6 text-sm font-medium text-white bg-white bg-opacity-10 rounded-full">
									2
								</span>
								<span className="text-white text-opacity-60">
									Set up your workspace
								</span>
							</div>
							<div className="flex items-center gap-3 px-6 py-4 bg-white bg-opacity-5 rounded-xl">
								<span className="flex items-center justify-center w-6 h-6 text-sm font-medium text-white bg-white bg-opacity-10 rounded-full">
									3
								</span>
								<span className="text-white text-opacity-60">
									Set up your profile
								</span>
							</div>
						</div>
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
							Sign Up Account
						</h2>
						<p className="text-[0.9375rem] text-gray-400">
							Enter your personal data to create your account.
						</p>
					</motion.div>
					<motion.div variants={itemVariants}>
						<RegisterForm />
					</motion.div>
				</div>
			</motion.div>
		</div>
	)
}
