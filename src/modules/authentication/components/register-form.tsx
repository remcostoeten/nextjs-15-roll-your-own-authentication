'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Checkbox, Input } from '@/shared/components/ui'
import { CoreButton } from '@/shared/components/core/core-button'
import { formAnimations } from '@/shared/animations/form'
import { registerMutation } from '../api/mutations/register'
import type { RegisterUserInput } from '../models/z.user'

interface RegisterFormProps {
	onSubmit: (data: RegisterUserInput) => Promise<void>
}

export function RegisterForm({ onSubmit }: RegisterFormProps) {
	const router = useRouter()
	const formRef = useRef<HTMLFormElement>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		setIsLoading(true)
		setError(null)

		if (!formRef.current) return

		const formData = new FormData(formRef.current)

		try {
			const result = await registerMutation(formData)

			if (result.success) {
				toast.success(result.message || 'Registration successful', {
					description: 'Redirecting you to the dashboard...',
				})
				router.push('/dashboard')
			} else {
				toast.error(result.message || 'Registration failed')
				setError(result.message || 'Registration failed')
			}
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Registration failed'
			toast.error(message)
			setError(message)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<motion.div
			variants={formAnimations.container}
			initial="hidden"
			animate="show"
		>
			<form
				ref={formRef}
				onSubmit={handleFormSubmit}
				className="flex flex-col w-full"
			>
				{error && <div className="mb-4 p-4 bg-red-500/10 text-red-500 rounded-lg">{error}</div>}

				<motion.div variants={formAnimations.item}>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<Input
								label="First name"
								name="firstName"
								type="text"
								placeholder="First Name"
								required
								className="mb-5"
							/>
						</div>
						<div>
							<Input
								label="Last name"
								name="lastName"
								type="text"
								placeholder="Last Name"
								required
								className="mb-5"
							/>
						</div>
					</div>
				</motion.div>

				<motion.div variants={formAnimations.item}>
					<Input
						label="Email address"
						name="email"
						type="email"
						placeholder="Email"
						required
						className="mb-5"
					/>
				</motion.div>

				<motion.div variants={formAnimations.item}>
					<Input
						label="Password"
						name="password"
						type="password"
						placeholder="Password"
						required
						showPasswordToggle
						className="mb-5"
					/>
				</motion.div>

				<motion.div variants={formAnimations.item}>
					<Checkbox
						name="terms"
						id="terms"
						label="I agree to the Terms of Service and Privacy Policy"
						labelClassName="text-neutral-300 -translate-y-1 text-sm"
						required
					/>
				</motion.div>

				<motion.div variants={formAnimations.item}>
					<CoreButton
						type="submit"
						variant="primary"
						fullWidth
						isLoading={isLoading}
						loadingText="Creating account..."
						className="mt-5"
					>
						Create account
					</CoreButton>
				</motion.div>
			</form>
		</motion.div>
	)
}
