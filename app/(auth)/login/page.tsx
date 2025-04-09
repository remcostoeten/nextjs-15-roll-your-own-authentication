import type { Metadata } from 'next'
import LoginView from '@/views/authentication/login-view'

export const metadata: Metadata = {
	title: 'Login | Modern Auth',
	description: 'Login to your account',
}

export default function LoginPage() {
	return <LoginView />
}
