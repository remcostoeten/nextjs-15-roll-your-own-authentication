'use client'

import PasswordStrengthGauge from '@/components/password-strength-gauge'
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Input
} from '@/shared/ui'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { showToast } from '../../../../lib/toast'
import { registerMutation } from '../../../../mutations/register'

export default function RegisterPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		if (password !== confirmPassword) {
			showToast.error('Passwords do not match')
			setIsLoading(false)
			return
		}

		const result = await registerMutation(email, password)

		if (result.success) {
			showToast.success(result.message || 'Registration successful!')
			router.push('/login?registered=true')
		} else {
			showToast.error(result.error || 'Registration failed')
		}

		setIsLoading(false)
	}

	return (
		<div className="flex justify-center items-center min-h-[calc(100vh-120px)]">
			<Card className="w-[350px] bg-card">
				<CardHeader>
					<CardTitle>Register</CardTitle>
					<CardDescription>Create a new account</CardDescription>
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
								className="bg-background"
							/>
						</div>
						<div className="space-y-2">
							<Input
								type="password"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className="bg-background"
							/>
							<PasswordStrengthGauge password={password} />
						</div>
						<div className="space-y-2">
							<Input
								type="password"
								placeholder="Confirm Password"
								value={confirmPassword}
								onChange={(e) =>
									setConfirmPassword(e.target.value)
								}
								required
								className="bg-background"
							/>
						</div>
						<Button
							type="submit"
							className="w-full"
							disabled={isLoading}
						>
							{isLoading ? 'Registering...' : 'Register'}
						</Button>
						<div className="text-center text-sm text-muted-foreground">
							Already have an account?{' '}
							<Link
								href="/login"
								className="text-primary hover:underline"
							>
								Login
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
			<ToastContainer />
		</div>
	)
}
