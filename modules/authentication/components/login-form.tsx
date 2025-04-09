'use client'

import type React from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '../api/mutations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { customToast } from '@/components/ui/custom-toast'
import { OAuthButtons } from './oauth-buttons'
import { getOAuthProviders } from '../config/oauth-provider-config'

export function LoginForm() {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()
	const { mainProviders, additionalProviders } = getOAuthProviders()

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setIsLoading(true)
		setError(null)

		try {
			const formData = new FormData(event.currentTarget)
			const response = await login(formData)

			if (response.error) {
				setError(response.error)
				customToast.error({
					title: 'Login failed',
					description: response.error,
				})
			} else if (response.success) {
				customToast.success({
					title: 'Welcome back!',
					description: 'You have been logged in successfully.',
				})

				// Redirect to dashboard
				setTimeout(() => {
					router.push('/dashboard')
					router.refresh()
				}, 1000)
			}
		} catch (error) {
			console.error('Login error:', error)
			setError('An unexpected error occurred. Please try again.')
			customToast.error({
				title: 'Login failed',
				description: 'An unexpected error occurred. Please try again.',
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="mx-auto max-w-md space-y-6 p-4">
			<div className="space-y-2 text-center">
				<h1 className="text-3xl font-bold">Login</h1>
				<p className="text-gray-500 dark:text-gray-400">
					Enter your credentials to access your account
				</p>
			</div>
			<div className="space-y-4">
				<form
					onSubmit={handleSubmit}
					className="space-y-4"
				>
					<div className="space-y-2">
						<Label htmlFor="emailOrUsername">
							Email or Username
						</Label>
						<Input
							id="emailOrUsername"
							name="emailOrUsername"
							placeholder="Enter your email or username"
							required
							type="text"
						/>
					</div>
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label htmlFor="password">Password</Label>
							<a
								className="text-sm text-blue-500 hover:text-blue-600"
								href="/forgot-password"
							>
								Forgot password?
							</a>
						</div>
						<Input
							id="password"
							name="password"
							placeholder="Enter your password"
							required
							type="password"
						/>
					</div>
					{error && (
						<div className="rounded-md bg-red-50 p-2 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-300">
							{error}
						</div>
					)}
					<Button
						className="w-full"
						type="submit"
						disabled={isLoading}
					>
						{isLoading ? 'Logging in...' : 'Login'}
					</Button>
				</form>
				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-white px-2 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
							Or continue with
						</span>
					</div>
				</div>
				<OAuthButtons
					mainProviders={mainProviders}
					additionalProviders={additionalProviders}
				/>
				<div className="text-center text-sm">
					Don&apos;t have an account?{' '}
					<a
						className="text-blue-500 hover:text-blue-600"
						href="/register"
					>
						Register
					</a>
				</div>
			</div>
		</div>
	)
}
