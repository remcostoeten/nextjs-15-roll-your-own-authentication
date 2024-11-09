'use client'

import { signUp } from '@/features/auth/actions/sign-up.action'
import { useFormState } from 'react-dom'
import type { AuthState } from '../types'

const initialState: AuthState = {
	isAuthenticated: false,
	isLoading: false
}

export default function SignUpForm() {
	const [state, formAction] = useFormState(signUp, initialState)

	return (
		<form action={formAction} className="space-y-4">
			{/* ... rest of your form ... */}
			{state?.error?._form && (
				<div className="text-red-500 text-sm">
					{state.error._form[0]}
				</div>
			)}
		</form>
	)
}
