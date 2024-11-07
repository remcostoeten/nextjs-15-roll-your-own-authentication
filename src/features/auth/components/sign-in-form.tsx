'use client'

import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { signIn } from '../actions/auth'
import type { AuthState } from '../types'
import SubmitButton from './submit-button'

const initialState: AuthState = null

export default function SignInForm() {
	const [state, formAction] = useActionState(signIn, initialState)

	useEffect(() => {
		// Only show toasts if state exists and has errors
		if (state && 'error' in state) {
			if (state.error.email) {
				toast.error(state.error.email[0])
			}
			if (state.error.password) {
				toast.error(state.error.password[0])
			}
			if (state.error._form) {
				toast.error(state.error._form[0])
			}
		}
	}, [state]) // Only run when state changes

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
