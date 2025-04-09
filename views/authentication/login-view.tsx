'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthForm } from '@/modules/authentication/components/auth-form'
import { AuthContainer } from '../../modules/authentication/components/auth-container'
import { AuthHeader } from '@/modules/authentication/components/auth-header'
import { OAuthProviders } from '@/modules/authentication/components/oauth-providers'
import { EmailPasswordForm } from '@/modules/authentication/components/email-password-form'
import { Separator } from '@/components/ui/separator'
import { login as loginAction } from '@/modules/authentication/api/mutations'
import { customToast } from '@/components/ui/custom-toast'

export default function LoginView() {
	const [showMoreProviders, setShowMoreProviders] = useState(false)
	const router = useRouter()

	// Wrapper function to handle the login action
	const handleLogin = async (formData: FormData) => {
		// Create a new FormData object with the correct field name
		const newFormData = new FormData()
		newFormData.append('emailOrUsername', formData.get('email') as string)
		newFormData.append('password', formData.get('password') as string)

		// Add remember me flag if checked
		const rememberMe = formData.get('remember') === 'on'
		if (rememberMe) {
			newFormData.append('remember', 'true')
		}

		const result = await loginAction(newFormData)
		if (result.error) {
			customToast.error({
				title: 'Login failed',
				description: result.error,
			})
			return
		}

		if (result.success) {
			customToast.success({
				title: 'Welcome back!',
				description: 'You have been successfully logged in.',
			})

			setTimeout(() => {
				router.push('/dashboard')
				router.refresh()
			}, 1000)
		}
	}

	return (
		<AuthContainer>
			<AuthHeader
				title="Sign in to your account"
				description="Enter your credentials to access your account"
			/>

			<AuthForm action={handleLogin}>
				<OAuthProviders
					showMoreProviders={showMoreProviders}
					onToggleMoreProvidersAction={() =>
						setShowMoreProviders(!showMoreProviders)
					}
				/>

				<div className="relative my-6">
					<Separator />
					<span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
						or continue with email
					</span>
				</div>

				<EmailPasswordForm type="login" />

				<div className="mt-6 text-center text-sm">
					<span className="text-muted-foreground">
						Don&apos;t have an account?
					</span>{' '}
					<Link
						href="/register"
						className="font-medium text-primary underline-offset-4 hover:underline transition-colors"
					>
						Register here
					</Link>
				</div>
			</AuthForm>
		</AuthContainer>
	)
}
