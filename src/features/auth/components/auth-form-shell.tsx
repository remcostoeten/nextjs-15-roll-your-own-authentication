'use client'

import { Button } from '@/shared/components/ui'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { signIn, signUp } from '../actions'
import { AuthState } from '../types'

const initialState: AuthState = {
	isAuthenticated: false,
	isLoading: false,
	error: undefined
}

function SubmitButton() {
	const { pending } = useFormStatus()

	return (
		<Button type="submit" className="w-full" disabled={pending}>
			{pending ? (
				<>
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					Please wait
				</>
			) : (
				'Continue'
			)}
		</Button>
	)
}

interface AuthFormProps {
	type: 'sign-in' | 'sign-up'
}

export function AuthForm({ type }: AuthFormProps) {
	const router = useRouter()
	const [state, formAction] = useFormState(
		type === 'sign-in' ? signIn : signUp,
		initialState
	)

	useEffect(() => {
		if (state?.success) {
			router.push('/dashboard')
			router.refresh() // Refresh the router cache
		}
	}, [state?.success, router])

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader>
				<CardTitle>
					{type === 'sign-in' ? 'Welcome back' : 'Create an account'}
				</CardTitle>
				<CardDescription>
					{type === 'sign-in'
						? 'Enter your credentials to access your account'
						: 'Enter your details to create your account'}
				</CardDescription>
			</CardHeader>
			<form action={formAction}>
				<CardContent className="space-y-4">
					{state?.error?._form && (
						<div className="p-3 bg-red-100 border border-red-400 rounded text-red-700 text-sm">
							{state.error._form.map((error, i) => (
								<p key={i}>{error}</p>
							))}
						</div>
					)}
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							required
							placeholder="you@example.com"
							autoComplete={
								type === 'sign-in' ? 'username' : 'email'
							}
						/>
						{state?.error?.email && (
							<p className="text-sm text-red-600">
								{state.error.email[0]}
							</p>
						)}
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							name="password"
							type="password"
							required
							placeholder="••••••••"
							autoComplete={
								type === 'sign-in'
									? 'current-password'
									: 'new-password'
							}
						/>
						{state?.error?.password && (
							<p className="text-sm text-red-600">
								{state.error.password[0]}
							</p>
						)}
					</div>
					{type === 'sign-up' && (
						<div className="space-y-2">
							<Label htmlFor="confirmPassword">
								Confirm Password
							</Label>
							<Input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								required
								placeholder="••••••••"
								autoComplete="new-password"
							/>
							{state?.error?.confirmPassword && (
								<p className="text-sm text-red-600">
									{state.error.confirmPassword[0]}
								</p>
							)}
						</div>
					)}
				</CardContent>
				<CardFooter className="flex flex-col gap-4">
					<SubmitButton />
					{type === 'sign-in' ? (
						<p className="text-sm text-center text-muted-foreground">
							Don't have an account?{' '}
							<Button
								variant="link"
								className="p-0 h-auto font-normal"
								onClick={() => router.push('/sign-up')}
							>
								Sign up
							</Button>
						</p>
					) : (
						<p className="text-sm text-center text-muted-foreground">
							Already have an account?{' '}
							<Button
								variant="link"
								className="p-0 h-auto font-normal"
								onClick={() => router.push('/sign-in')}
							>
								Sign in
							</Button>
						</p>
					)}
				</CardFooter>
			</form>
		</Card>
	)
}
