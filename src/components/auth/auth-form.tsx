'use client'

import { registerMutation } from '@/mutations/register'
import { useToast } from '@/shared/primitives/toast'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { EyeIcon, GithubIcon, GoogleIcon } from './icons'
import InputField from './input-fields'
import type { FormData } from './types'

export function RegisterForm() {
	const [formData, setFormData] = React.useState<FormData>({
		firstName: '',
		lastName: '',

		email: '',
		password: ''
	})
	const [isLoading, setIsLoading] = React.useState(false)
	const router = useRouter()
	const { toast, promise } = useToast()

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()

		try {
			await promise(
				registerMutation(
					formData.email,
					formData.password,
					formData.firstName
				),
				{
					loading: 'Creating your account...',
					success: () => {
						router.push('/login?registered=true')
						return 'Account created successfully! Please log in.'
					},
					error: (err) => `Registration failed: ${err instanceof Error ? err.message : 'Please try again'}`
				},
				{
					duration: 5000,
					position: 'bottom-center'
				}
			)
		} catch (error) {
			// Error is handled by the promise toast
			console.error('Registration error:', error)
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
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

			<div className="flex items-center gap-4">
				<div className="h-px flex-1 bg-[#222]" />
				<span className="text-sm text-gray-500">Or</span>
				<div className="h-px flex-1 bg-[#222]" />
			</div>

			<div className="space-y-4">
				<div className="grid grid-cols-2 gap-3">
					<InputField
						label="First Name"
						placeholder="eg. John"
						value={formData.firstName || ''}
						onChange={(value) => setFormData(prev => ({ ...prev, firstName: value }))}
						index={2}
					/>
					<InputField
						label="Last Name"
						placeholder="eg. Franc"
						value={formData.lastName || ''}
						onChange={(value) => setFormData(prev => ({ ...prev, lastName: value }))}
						index={3}
					/>
				</div>

				<InputField
					label="Email"
					placeholder="eg. johnfrans@gmail.com"
					type="email"
					value={formData.email}
					onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
					index={4}
					required
				/>

				<InputField
					label="Password"
					placeholder="Enter your password"
					type="password"
					icon={<EyeIcon />}
					helperText="Must be at least 8 characters."
					value={formData.password}
					onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
					index={5}
					required
				/>
			</div>

			<button
				type="submit"
				disabled={isLoading}
				className="w-full py-3 text-[0.9375rem] font-semibold text-black bg-white rounded-xl hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:scale-100 focus:outline-none"
			>
				{isLoading ? (
					<motion.div
						className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
					/>
				) : (
					'Sign Up'
				)}
			</button>

			<p className="text-center text-[0.9375rem] text-gray-400">
				Already have an account?{' '}
				<a
					href="/login"
					className="font-semibold text-white hover:underline focus:outline-none"
				>
					Log in
				</a>
			</p>
		</form>
	)
}
