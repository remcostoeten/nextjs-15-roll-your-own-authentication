'use client'

import { register } from '@/app/server/mutations'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'

export default function RegisterPage() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string>()

	async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setIsLoading(true)
		setError(undefined)

		const formData = new FormData(event.currentTarget)
		const email = formData.get('email') as string
		const password = formData.get('password') as string
		const confirmPassword = formData.get('confirmPassword') as string

		try {
			const result = await register(email, password, confirmPassword)

			if (result.success) {
				toast.success(
					'Account created successfully! Redirecting to login...',
					{
						duration: 3000
					}
				)
				setTimeout(() => {
					router.push('/login')
				}, 1500)
			} else {
				setError(result.error)
				toast.error(result.error || 'Registration failed')
			}
		} catch (err) {
			console.error('Registration error:', err)
			const errorMessage = 'An unexpected error occurred'
			setError(errorMessage)
			toast.error(errorMessage)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<>
			<Toaster position="top-center" />
			<div className="container flex h-screen w-screen flex-col items-center justify-center">
				<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
					<div className="flex flex-col space-y-2 text-center">
						<h1 className="text-2xl font-semibold tracking-tight">
							Create an account
						</h1>
						<p className="text-sm text-muted-foreground">
							Enter your email below to create your account
						</p>
					</div>

					<form onSubmit={onSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="name@example.com"
								required
								disabled={isLoading}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								name="password"
								type="password"
								required
								disabled={isLoading}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirmPassword">
								Confirm Password
							</Label>
							<Input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								required
								disabled={isLoading}
							/>
						</div>

						{error && (
							<Alert variant="destructive">
								<AlertTitle>Error</AlertTitle>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<Button
							type="submit"
							className="w-full"
							disabled={isLoading}
						>
							{isLoading
								? 'Creating account...'
								: 'Create account'}
						</Button>
					</form>

					<div className="text-center text-sm">
						Already have an account?{' '}
						<a href="/login" className="underline hover:text-brand">
							Sign in
						</a>
					</div>
				</div>
			</div>
		</>
	)
}
