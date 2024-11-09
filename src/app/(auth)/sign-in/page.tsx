import { AuthForm } from '@/features/auth/components/auth-form-shell'
import { validateSession } from '@/features/auth/services/session.service'
import { redirect } from 'next/navigation'

export default async function SignInPage() {
	const session = await validateSession()
	if (session) {
		redirect('/dashboard')
	}

	return (
		<div className="container flex items-center justify-center min-h-screen py-8">
			<AuthForm type="sign-in" />
		</div>
	)
}
