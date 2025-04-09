'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthForm } from '@/modules/authentication/components/auth-form'
import { AuthContainer } from '../../modules/authentication/components/auth-container'
import { AuthHeader } from '@/modules/authentication/components/auth-header'
import { OAuthProviders } from '@/modules/authentication/components/oauth-providers'
import { RegisterForm } from '@/modules/authentication/components/register-form'
import { Separator } from '@/components/ui/separator'
import {
	register as registerAction,
	login,
} from '@/modules/authentication/api/mutations'
import { customToast } from '@/components/ui/custom-toast'

export default function RegisterView() {
	const [showMoreProviders, setShowMoreProviders] = useState(false)
	const router = useRouter()

	const handleRegister = async (formData: FormData) => {
		try {
			// Check if terms are accepted
			const termsAccepted = formData.get('terms') === 'on'
			if (!termsAccepted) {
				customToast.error({
					title: 'Registration failed',
					description:
						'You must accept the Terms of Service and Privacy Policy to continue.',
				})
				return
			}

			const result = await registerAction(formData)

			if (result.error) {
				customToast.error({
					title: 'Registration failed',
					description: result.error,
				})
				return
			}

			if (result.success) {
				customToast.success({
					title: 'Account created',
					description: 'Your account has been created successfully.',
				})

				// Automatically log in the user after successful registration
				const loginFormData = new FormData()
				loginFormData.append(
					'emailOrUsername',
					formData.get('email') as string
				)
				loginFormData.append(
					'password',
					formData.get('password') as string
				)

				const loginResult = await login(loginFormData)

				if (loginResult.error) {
					customToast.error({
						title: 'Auto-login failed',
						description:
							'Your account was created, but automatic login failed. Please log in manually.',
					})
					router.push('/login')
					return
				}

				if (loginResult.success) {
					customToast.success({
						title: 'Welcome!',
						description: 'You have been automatically logged in.',
					})

					setTimeout(() => {
						router.push('/dashboard')
						router.refresh()
					}, 1000)
				}
			}
		} catch (error) {
			console.error('Registration error:', error)
			customToast.error({
				title: 'Registration failed',
				description: 'An unexpected error occurred. Please try again.',
			})
		}
	}

	return (
		<AuthContainer>
			<AuthHeader
				title="Create your account"
				description="Sign up to get started with our platform"
			/>

			<AuthForm action={handleRegister}>
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

				<RegisterForm />

				<div className="mt-6 text-center text-sm">
					<span className="text-muted-foreground">
						Already have an account?
					</span>{' '}
					<Link
						href="/login"
						className="font-medium text-primary underline-offset-4 hover:underline transition-colors"
					>
						Sign in here
					</Link>
				</div>
			</AuthForm>
		</AuthContainer>
	)
}
