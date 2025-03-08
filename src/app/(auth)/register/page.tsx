'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/modules/authentication/hooks'

export default function RegisterPage() {
	const router = useRouter()
	const { register, isLoading, error } = useAuth()
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		confirmPassword: '',
		firstName: '',
		lastName: '',
	})
	const [errors, setErrors] = useState<{
		email?: string
		password?: string
		confirmPassword?: string
		firstName?: string
		lastName?: string
	}>({})

	// Get the callbackUrl parameter from the URL, if provided
	const searchParams =
		typeof window !== 'undefined'
			? new URLSearchParams(window.location.search)
			: new URLSearchParams()
	const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
		// Clear error when user types
		if (errors[name as keyof typeof errors]) {
			setErrors((prev) => ({ ...prev, [name]: undefined }))
		}
	}

	const validateForm = () => {
		const newErrors: {
			email?: string
			password?: string
			confirmPassword?: string
			firstName?: string
			lastName?: string
		} = {}

		if (!formData.email) {
			newErrors.email = 'Email is required'
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = 'Email is invalid'
		}

		if (!formData.password) {
			newErrors.password = 'Password is required'
		} else if (formData.password.length < 8) {
			newErrors.password = 'Password must be at least 8 characters'
		} else if (!/[A-Z]/.test(formData.password)) {
			newErrors.password =
				'Password must contain at least one uppercase letter'
		} else if (!/[a-z]/.test(formData.password)) {
			newErrors.password =
				'Password must contain at least one lowercase letter'
		} else if (!/[0-9]/.test(formData.password)) {
			newErrors.password = 'Password must contain at least one number'
		}

		if (!formData.confirmPassword) {
			newErrors.confirmPassword = 'Please confirm your password'
		} else if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = 'Passwords do not match'
		}

		if (formData.firstName && formData.firstName.length < 2) {
			newErrors.firstName = 'First name must be at least 2 characters'
		}

		if (formData.lastName && formData.lastName.length < 2) {
			newErrors.lastName = 'Last name must be at least 2 characters'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!validateForm()) {
			return
		}

		try {
			await register(formData)
			// User is automatically logged in after registration
			router.push(callbackUrl)
		} catch (error) {
			// Error is already handled by the auth store
		}
	}

	return (
		<div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#0a0a0a] text-white">
			<div className="w-full max-w-[500px] px-8">
				{/* Logo */}
				<div className="mb-8 flex justify-center">
					<div className="h-12 w-12 rounded-full bg-[#2E71E5] flex items-center justify-center">
						<svg
							viewBox="0 0 24 24"
							width="24"
							height="24"
							stroke="currentColor"
							strokeWidth="2"
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
							<polyline points="10 17 15 12 10 7" />
							<line
								x1="15"
								y1="12"
								x2="3"
								y2="12"
							/>
						</svg>
					</div>
				</div>

				{/* Title */}
				<div className="mb-8 text-center">
					<h1 className="mb-2 text-3xl font-bold">
						Create an account
					</h1>
					<p className="text-sm text-gray-400">
						Already have an account?{' '}
						<Link
							href="/login"
							className="text-[#2E71E5] hover:underline"
						>
							Sign in
						</Link>
					</p>
				</div>

				<form
					id="registerForm"
					onSubmit={handleSubmit}
				>
					{error && (
						<div className="mb-6 rounded-md bg-red-900/20 p-3 text-sm text-red-500 border border-red-900/50">
							{error}
						</div>
					)}

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-5">
						<div>
							<label
								htmlFor="firstName"
								className="mb-2 block text-sm font-medium text-gray-200"
							>
								First Name
							</label>
							<input
								id="firstName"
								name="firstName"
								type="text"
								placeholder="John"
								value={formData.firstName}
								onChange={handleChange}
								className={`w-full rounded-md border bg-[#111111] px-3 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2E71E5] ${
									errors.firstName
										? 'border-red-500'
										: 'border-gray-700'
								}`}
							/>
							{errors.firstName && (
								<p className="mt-1.5 text-xs text-red-500">
									{errors.firstName}
								</p>
							)}
						</div>

						<div>
							<label
								htmlFor="lastName"
								className="mb-2 block text-sm font-medium text-gray-200"
							>
								Last Name
							</label>
							<input
								id="lastName"
								name="lastName"
								type="text"
								placeholder="Doe"
								value={formData.lastName}
								onChange={handleChange}
								className={`w-full rounded-md border bg-[#111111] px-3 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2E71E5] ${
									errors.lastName
										? 'border-red-500'
										: 'border-gray-700'
								}`}
							/>
							{errors.lastName && (
								<p className="mt-1.5 text-xs text-red-500">
									{errors.lastName}
								</p>
							)}
						</div>
					</div>

					<div className="mb-5">
						<label
							htmlFor="email"
							className="mb-2 block text-sm font-medium text-gray-200"
						>
							Email address
						</label>
						<input
							id="email"
							name="email"
							type="email"
							placeholder="you@example.com"
							value={formData.email}
							onChange={handleChange}
							className={`w-full rounded-md border bg-[#111111] px-3 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2E71E5] ${
								errors.email
									? 'border-red-500'
									: 'border-gray-700'
							}`}
							required
						/>
						{errors.email && (
							<p className="mt-1.5 text-xs text-red-500">
								{errors.email}
							</p>
						)}
					</div>

					<div className="mb-5">
						<label
							htmlFor="password"
							className="mb-2 block text-sm font-medium text-gray-200"
						>
							Password
						</label>
						<input
							id="password"
							name="password"
							type="password"
							placeholder="••••••••"
							value={formData.password}
							onChange={handleChange}
							className={`w-full rounded-md border bg-[#111111] px-3 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2E71E5] ${
								errors.password
									? 'border-red-500'
									: 'border-gray-700'
							}`}
							required
						/>
						{errors.password && (
							<p className="mt-1.5 text-xs text-red-500">
								{errors.password}
							</p>
						)}
						{!errors.password && (
							<p className="mt-1.5 text-xs text-gray-500">
								Password must be at least 8 characters and
								include uppercase, lowercase, and numbers
							</p>
						)}
					</div>

					<div className="mb-5">
						<label
							htmlFor="confirmPassword"
							className="mb-2 block text-sm font-medium text-gray-200"
						>
							Confirm Password
						</label>
						<input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							placeholder="••••••••"
							value={formData.confirmPassword}
							onChange={handleChange}
							className={`w-full rounded-md border bg-[#111111] px-3 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2E71E5] ${
								errors.confirmPassword
									? 'border-red-500'
									: 'border-gray-700'
							}`}
							required
						/>
						{errors.confirmPassword && (
							<p className="mt-1.5 text-xs text-red-500">
								{errors.confirmPassword}
							</p>
						)}
					</div>

					<div className="mb-6 flex items-center">
						<input
							id="terms"
							name="terms"
							type="checkbox"
							className="h-4 w-4 rounded border-gray-600 bg-[#111111] text-[#2E71E5] focus:ring-[#2E71E5]"
							required
						/>
						<label
							htmlFor="terms"
							className="ml-2 block text-sm text-gray-300"
						>
							I agree to the{' '}
							<Link
								href="/terms"
								className="text-[#2E71E5] hover:underline"
							>
								Terms of Service
							</Link>{' '}
							and{' '}
							<Link
								href="/privacy"
								className="text-[#2E71E5] hover:underline"
							>
								Privacy Policy
							</Link>
						</label>
					</div>

					<button
						id="registerButton"
						type="submit"
						className="w-full rounded-md bg-[#2E71E5] py-2 px-4 text-sm font-medium text-white transition-colors hover:bg-[#2E71E5]/90 focus:outline-none focus:ring-2 focus:ring-[#2E71E5] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center"
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<svg
									className="mr-2 h-4 w-4 animate-spin text-current"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									/>
									<path
										className="opacity-75"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										fill="currentColor"
									/>
								</svg>
								<span>Creating account...</span>
							</>
						) : (
							<span>Create account &rarr;</span>
						)}
					</button>
				</form>

				<div className="mt-8 text-center text-sm text-gray-500">
					By creating an account, you agree to our{' '}
					<Link
						href="/terms"
						className="text-[#2E71E5] hover:underline"
					>
						Terms of Service
					</Link>{' '}
					and{' '}
					<Link
						href="/privacy"
						className="text-[#2E71E5] hover:underline"
					>
						Privacy Policy
					</Link>
					.
				</div>
			</div>
		</div>
	)
}
