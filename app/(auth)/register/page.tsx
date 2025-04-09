import type { Metadata } from 'next'
import RegisterView from '@/views/authentication/register-view'

export const metadata: Metadata = {
	title: 'Register | Modern Auth',
	description: 'Create a new account',
}

export default function RegisterPage() {
	return <RegisterView />
}
