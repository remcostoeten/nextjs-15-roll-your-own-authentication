'use client'

import { signIn } from '@/features/auth/actions/auth'
import AuthFormShell from '@/features/auth/components/auth-form-shell'
import SignUpForm from '@/features/auth/components/sign-up-form'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function SignUpPage() {
	const router = useRouter()

	const handleSubmit = async (formData: FormData) => {
		const loadingToast = toast.loading('Creating your account...')

		try {
			const result = await signIn(formData)

			if ('redirect' in result) {
				toast.success('Account created successfully!', {
					id: loadingToast,
					description: "You'll be redirected to the dashboard"
				})
				router.push(result.redirect)
			} else {
				// Handle validation errors
				const errors = result.error
				if (errors.email) {
					toast.error('Email error', {
						id: loadingToast,
						description: errors.email[0]
					})
				}
				if (errors.password) {
					toast.error('Password error', {
						id: loadingToast,
						description: errors.password[0]
					})
				}
				if (errors._form) {
					toast.error('Sign up failed', {
						id: loadingToast,
						description: errors._form[0]
					})
				}
			}
		} catch (error) {
			toast.error('Something went wrong', {
				id: loadingToast,
				description:
					error instanceof Error ? error.message : 'Please try again'
			})
		}
	}

	return (
		<AuthFormShell variant="signup">
			<SignUpForm onSubmit={handleSubmit} />
		</AuthFormShell>
	)
}
