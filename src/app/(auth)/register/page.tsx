import RegisterView from '@/views/auth/register'
import { siteMetadata } from '@/core/config/metadata/base-metadata'
import { Metadata } from 'next'

export const metadata: Metadata = {
	...siteMetadata,
	title: 'Register | RYOA',
	description: 'Create a new account to get started with RYOA',
}

export default function RegisterPage() {
	return <RegisterView />
}
