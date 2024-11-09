'use client'

import { useRouter } from 'next/navigation'
import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { signUp } from '../actions/sign-out.action'
import type { AuthState } from '../types'
import SubmitButton from './submit-button'

export default function SignUpForm() {
	const router = useRouter()
	const [state, formAction] = useActionState<AuthState, FormData>(
		signUp,
		null
	)

	useEffect(() => {
		if (state) {
			if ('error' in state) {
				if (state.error.email) {
					toast.error('Email error', {
						description: state.error.email[0],
						className:
							'bg-zinc-900 text-white border border-zinc-700',
						descriptionClassName: 'text-zinc-400'
					})
				}
				if (state.error.password) {
					toast.error('Password error', {
						description: state.error.password[0],
						className:
							'bg-zinc-900 text-white border border-zinc-700',
						descriptionClassName: 'text-zinc-400'
					})
				}
				if (state.error.confirmPassword) {
					toast.error('Confirm Password error', {
						description: state.error.confirmPassword[0],
						className:
							'bg-zinc-900 text-white border border-zinc-700',
						descriptionClassName: 'text-zinc-400'
					})
				}
				if (state.error._form) {
					toast.error('Registration failed', {
						duration: 4000,
						className:
							'bg-zinc-900 text-white border border-zinc-700',
						descriptionClassName: 'text-zinc-400',
						description: state.error._form[0]
					})
				}
			} else {
				toast.success('Welcome! Your account has been created.', {
					duration: 3000,
					className: 'bg-zinc-900 text-white border border-zinc-700',
					descriptionClassName: 'text-zinc-400',
					description: "You'll be redirected to your dashboard"
				})
				router.push('/dashboard')
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

			<div>
				<input
					name="confirmPassword"
					type="password"
					placeholder="Confirm Password"
					aria-label="Confirm Password"
					className="w-full px-4 py-2 border border-zinc-700 rounded-md bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-white"
					required
				/>
			</div>

			<SubmitButton variant="signup" />
		</form>
	)
}
