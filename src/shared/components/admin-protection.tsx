'use server'

import { isAdminServer } from '@/features/auth/helper/is-admin.server'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

type ComponentProps = Record<string, unknown>

export async function withAdminProtection<T extends ComponentProps>(
	Component: React.ComponentType<T>,
	props: T,
	FallbackComponent: ReactNode = null
) {
	const isAdmin = await isAdminServer()

	if (!isAdmin) {
		if (FallbackComponent) {
			return FallbackComponent
		}
		redirect('/dashboard')
	}

	return <Component {...props} />
}
