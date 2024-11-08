'use client'

import { useRouter } from 'next/navigation'
import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { signIn } from '../actions/auth'
import type { AuthState } from '../types'
import SubmitButton from './submit-button'

export default function SignInForm() {
	const router = useRouter()
	const [state, formAction] = useActionState<AuthState, FormData>(
		signIn,
		null
	)

	useEffect(() => {
		if (state) {
			if ('error' in state) {
				if (state.error.email) {
					toast.error('Email error', {
						description: state.error.email[0]
					})
				}
				if (state.error.password) {
					toast.error('Password error', {
						description: state.error.password[0]
					})
				}
				if (state.error._form) {
					toast.error('Sign in failed', {
						description: state.error._form[0]
					})
				}
			} else if (state.isAuthenticated && state.user) {
				toast.success('Welcome back!', {
					description: "You've been successfully signed in"
				})
				// Trigger auth change event
				window.dispatchEvent(new Event('auth-change'))
				// Redirect to dashboard
				router.push('/dashboard')
				// Refresh the page data
				router.refresh()
			}
		}
	}, [state, router])

	return (
		<form action={formAction} className="space-y-4">
			<div>
				<input
					name="email"
					type="email"
					placeholder="Email"
					aria-label="Email"
					className="w-full px-4 py-2 border border-zinc-700 rounded-md bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-white"
					required
				/>
			</div>

			<div>
				<input
					name="password"
					type="password"
					placeholder="Password"
					aria-label="Password"
					className="w-full px-4 py-2 border border-zinc-700 rounded-md bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-white"
					required
				/>
			</div>

			<SubmitButton variant="signin" />
		</form>
	)
}
