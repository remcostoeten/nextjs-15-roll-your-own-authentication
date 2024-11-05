'use client'

import { useActionState } from 'react'
import { signIn } from '../actions/auth'
import type { AuthState } from '../types'
import SubmitButton from './submit-button'

const initialState: AuthState = null

export default function SignInForm() {
	const [state, formAction] = useActionState(signIn, initialState)

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
				{state?.error?.email && (
					<div className="text-sm text-red-500">{state.error.email[0]}</div>
				)}
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
				{state?.error?.password && (
					<div className="text-sm text-red-500">{state.error.password[0]}</div>
				)}
			</div>

			{state?.error?._form && (
				<div className="text-sm text-red-500">{state.error._form[0]}</div>
			)}

			<SubmitButton variant="signin" />
		</form>
	)
}
