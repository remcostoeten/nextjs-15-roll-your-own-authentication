'use client'

import { login } from '@/app/server/mutations'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

interface FormState {
	email: string
	password: string
}

type RateLimitInfo = {
	blocked: boolean
	blockedUntil?: Date
}

const initialFormState: FormState = {
	email: '',
	password: ''
}

export default function LoginPage() {
	const [formState, setFormState] = useState<FormState>(initialFormState)
	const [error, setError] = useState<string>('')
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo>({
		blocked: false
	})
	const [timeRemaining, setTimeRemaining] = useState<string>('')
	const router = useRouter()

	useEffect(() => {
		if (!rateLimitInfo.blockedUntil) return

		const updateTimer = () => {
			const now = new Date()
			const blockedUntil = new Date(rateLimitInfo.blockedUntil!)
			const diff = blockedUntil.getTime() - now.getTime()

			if (diff <= 0) {
				setRateLimitInfo({ blocked: false })
				setTimeRemaining('')
				return
			}

			const minutes = Math.floor(diff / 60000)
			const seconds = Math.floor((diff % 60000) / 1000)
			setTimeRemaining(
				`${minutes}:${seconds.toString().padStart(2, '0')}`
			)
		}

		updateTimer()
		const interval = setInterval(updateTimer, 1000)
		return () => clearInterval(interval)
	}, [rateLimitInfo.blockedUntil])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormState((prev) => ({
			...prev,
			[name]: value
		}))
		setError('')
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsLoading(true)
		setError('')

		try {
			const formData = new FormData(e.currentTarget)
			const result = await login(
				formData.get('email') as string,
				formData.get('password') as string
			)

			if (!result.success) {
				if (result.error?.includes('Too many login attempts')) {
					const blockedUntilMatch = result.error.match(/after (.+)/)
					if (blockedUntilMatch) {
						setRateLimitInfo({
							blocked: true,
							blockedUntil: new Date(blockedUntilMatch[1])
						})
					} else {
						setError(result.error)
					}
				} else {
					setError(result.error || '')
				}
				toast.error(result.error || '')
			} else {
				toast.success('Login successful!')
				router.push('/dashboard')
				router.refresh()
			}
		} catch {
			toast.error('An unexpected error occurred')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div className="text-center">
					<h1 className="text-3xl font-bold tracking-tight text-gray-900">
						Sign in to your account
					</h1>
					<p className="mt-2 text-sm text-gray-600">
						Or{' '}
						<a
							href="/register"
							className="font-medium text-indigo-600 hover:text-indigo-500"
						>
							create a new account
						</a>
					</p>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="rounded-md shadow-sm space-y-4">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700"
							>
								Email address
							</label>
							<Input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								placeholder="you@example.com"
								value={formState.email}
								onChange={handleChange}
								disabled={isLoading}
								className="mt-1"
							/>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700"
							>
								Password
							</label>
							<Input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								required
								placeholder="••••••••"
								value={formState.password}
								onChange={handleChange}
								disabled={isLoading}
								className="mt-1"
							/>
						</div>
					</div>

					{rateLimitInfo.blocked && timeRemaining && (
						<Alert variant="destructive" className="mt-4">
							<AlertTitle>Too Many Attempts</AlertTitle>
							<AlertDescription>
								Please wait {timeRemaining} before trying again
							</AlertDescription>
						</Alert>
					)}

					{error && !rateLimitInfo.blocked && (
						<Alert variant="destructive" className="mt-4">
							<AlertTitle>Login Failed</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<div className="flex items-center justify-between">
						<div className="text-sm">
							<a
								href="/forgot-password"
								className="font-medium text-indigo-600 hover:text-indigo-500"
							>
								Forgot your password?
							</a>
						</div>
					</div>

					<Button
						type="submit"
						disabled={isLoading || rateLimitInfo.blocked}
						className="w-full"
					>
						{isLoading
							? 'Signing in...'
							: rateLimitInfo.blocked
								? `Try again in ${timeRemaining}`
								: 'Sign in'}
					</Button>
				</form>
			</div>
		</div>
	)
}
