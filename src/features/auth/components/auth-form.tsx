'use client'

import { type FormEvent } from 'react'

type AuthFormProps = {
	type: 'sign-in' | 'sign-up'
	onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>
}

export default function AuthForm({ type, onSubmit }: AuthFormProps) {
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)
		// Handle sign in logic
	}

	return <AuthForm type="sign-in" onSubmit={handleSubmit} />
}
