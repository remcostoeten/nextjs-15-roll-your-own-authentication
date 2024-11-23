'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Button } from '../../../components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { showToast } from '../../../lib/toast'
import { loginMutation } from '../../../mutations/login'

export default function LoginPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()
	const searchParams = useSearchParams()

	useEffect(() => {
		if (searchParams.get('registered') === 'true') {
			showToast.success('Registration successful! Please log in.')
		}
	}, [searchParams])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		const result = await loginMutation(email, password)

		if (result.success) {
			showToast.success('Login successful!')
			router.push('/dashboard')
		} else {
			showToast.error(result.error || 'Login failed')
		}

		setIsLoading(false)
	}

	return (
		<div className="flex justify-center items-center min-h-screen">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>Login</CardTitle>
					<CardDescription>
						Enter your credentials to access your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Input
								type="email"
								placeholder="Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Input
								type="password"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						<Button
							type="submit"
							className="w-full"
							disabled={isLoading}
						>
							{isLoading ? 'Logging in...' : 'Login'}
						</Button>
						<div className="text-center text-sm text-muted-foreground">
							Don't have an account?{' '}
							<Link
								href="/register"
								className="text-primary hover:underline"
							>
								Register
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
			<ToastContainer />
		</div>
	)
}
