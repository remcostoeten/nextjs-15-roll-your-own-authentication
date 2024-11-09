'use client'

import { signIn } from '@/features/auth/actions/sign-in.action'
import { signUp } from '@/features/auth/actions/sign-up.action'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect } from 'react'
import type { AuthState } from '../types'

type AuthFormProps = {
	type: 'sign-in' | 'sign-up'
}

const initialState: AuthState = {
	isAuthenticated: false,
	isLoading: false
}

export function AuthForm({ type }: AuthFormProps) {
	const router = useRouter()
	const [state, formAction] = useActionState(
		type === 'sign-in' ? signIn : signUp,
		initialState
	)

	useEffect(() => {
		if (state?.isAuthenticated && state?.redirect) {
			router.push(state.redirect)
		}
	}, [state, router])

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
