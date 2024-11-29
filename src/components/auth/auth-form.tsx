'use client'

import { registerMutation } from '@/mutations/register'
import { useToastStore } from '@/shared/primitives/toast'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { EyeIcon, GithubIcon, GoogleIcon } from './icons'
import InputField from './input-fields'
import { RegisterButton } from './register-button'
import type { FormData } from './types'

const formVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.2
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

export function RegisterForm() {
	const [formData, setFormData] = React.useState<FormData>({
		firstName: '',
		email: '',
		password: ''
	})
	const [isLoading, setIsLoading] = React.useState(false)
	const router = useRouter()
	const { add: addToast } = useToastStore()

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setIsLoading(true)

		const toastId = addToast('Creating your account...', {
			isPending: true,
			showSpinner: true
		})

		try {
			await registerMutation(
				formData.email,
				formData.password,
				formData.firstName
			)

			addToast('Account created successfully! Please log in.', {
				variant: 'success',
				duration: 5000
			})

			router.push('/login?registered=true')
		} catch (error) {
			console.error('Registration error:', error)
			addToast(
				`Registration failed: ${error instanceof Error ? error.message : 'Please try again'}`,
				{
					variant: 'error',
					duration: 5000
				}
			)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<motion.form
			onSubmit={handleSubmit}
			className="space-y-6"
			variants={formVariants}
			initial="hidden"
			animate="visible"
		>
			<motion.div variants={itemVariants}>
				<div className="flex gap-3 w-full">
					<button
						className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1A1A1A] rounded-xl border border-white/20 transition-colors focus:outline-none"
						type="button"
					>
						<GoogleIcon />
						<span className="text-[0.9375rem]">Google</span>
					</button>
					<button
						className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1A1A1A] rounded-xl border border-white/20 transition-colors focus:outline-none"
						type="button"
					>
						<GithubIcon />
						<span className="text-[0.9375rem]">GitHub</span>
					</button>
				</div>
			</motion.div>

			<motion.div variants={itemVariants}>
				<InputField
					label="Name"
					type="text"
					placeholder="Enter your name"
					value={formData.firstName}
					onChange={(value) =>
						setFormData((prev) => ({ ...prev, firstName: value }))
					}
					index={1}
					required
				/>
			</motion.div>

			<motion.div variants={itemVariants}>
				<InputField
					label="Email"
					type="email"
					placeholder="Enter your email"
					value={formData.email}
					onChange={(value) =>
						setFormData((prev) => ({ ...prev, email: value }))
					}
					index={2}
					required
				/>
			</motion.div>

			<motion.div variants={itemVariants} className="space-y-4">
				<InputField
					label="Password"
					placeholder="Enter your password"
					type="password"
					icon={<EyeIcon />}
					helperText="Must be at least 8 characters."
					value={formData.password}
					onChange={(value) =>
						setFormData((prev) => ({ ...prev, password: value }))
					}
					index={3}
					required
				/>
			</motion.div>

			<RegisterButton isLoading={isLoading} />

			<motion.p
				variants={itemVariants}
				className="text-center text-[0.9375rem] text-gray-400"
			>
				Already have an account?{' '}
				<a
					href="/login"
					className="font-semibold text-white hover:underline focus:outline-none"
				>
					Log in
				</a>
			</motion.p>
		</motion.form>
	)
}
