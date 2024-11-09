import { validateSession } from '@/features/auth/services/session.service'
import { redirect } from 'next/navigation'

export default async function AuthLayout({
	children
}: {
	children: React.ReactNode
}) {
	const session = await validateSession()

	if (session) {
		redirect('/dashboard')
	}

	return (
		<div className="min-h-screen flex items-center justify-center">
			{children}
		</div>
	)
}
