'use client'

import { loginMutation } from '@/mutations/login'
import { useToastStore } from '@/shared/primitives/toast'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'
import { EyeIcon, GithubIcon, GoogleIcon } from './icons'
import InputField from './input-fields'
import { LoginButton } from './login-button'
import type { LoginFormData } from './types'

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

export function LoginForm() {
	const [formData, setFormData] = React.useState<LoginFormData>({
		email: '',
		password: ''
	})
	const [isLoading, setIsLoading] = React.useState(false)
	const router = useRouter()
	const searchParams = useSearchParams()
	const { add: addToast } = useToastStore()

	React.useEffect(() => {
		if (searchParams.get('registered') === 'true') {
			addToast('Registration successful! Please log in.', {
				variant: 'success',
				duration: 5000
			})
		}
	}, [addToast, searchParams])

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setIsLoading(true)

		const toastId = addToast('Signing in...', {
			isPending: true,
			showSpinner: true
		})

		try {
			await loginMutation(formData.email, formData.password)
			addToast('Logged in successfully!', {
				variant: 'success',
				duration: 3000
			})
			router.push('/dashboard')
		} catch (error) {
			console.error('Login error:', error)
			addToast(
				`Login failed: ${error instanceof Error ? error.message : 'Please try again'}`,
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
						<span className="text-[0.9375rem]">Github</span>
					</button>
				</div>
			</motion.div>

			<motion.div
				variants={itemVariants}
				className="flex items-center gap-4"
			>
				<div className="h-px flex-1 bg-[#222]" />
				<span className="text-sm text-gray-500">Or</span>
				<div className="h-px flex-1 bg-[#222]" />
			</motion.div>

			<motion.div variants={itemVariants} className="space-y-4">
				<InputField
					label="Email"
					placeholder="eg. johnfrans@gmail.com"
					type="email"
					value={formData.email}
					onChange={(value) =>
						setFormData((prev) => ({ ...prev, email: value }))
					}
					index={1}
					required
				/>

				<InputField
					label="Password"
					placeholder="Enter your password"
					type="password"
					icon={<EyeIcon />}
					value={formData.password}
					onChange={(value) =>
						setFormData((prev) => ({ ...prev, password: value }))
					}
					index={2}
					required
				/>
			</motion.div>

			<LoginButton isLoading={isLoading} />

			<motion.p
				variants={itemVariants}
				className="text-center text-[0.9375rem] text-gray-400"
			>
				Don't have an account?{' '}
				<a
					href="/register"
					className="font-semibold text-white hover:underline focus:outline-none"
				>
					Sign up
				</a>
			</motion.p>
		</motion.form>
	)
}
