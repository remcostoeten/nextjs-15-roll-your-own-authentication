'use server'

import { getSession } from '@/features/auth/session'
import React, { ComponentType, ReactNode } from 'react'

/**
 * Server-side utility to check if the current user is an admin
 * @returns Promise<boolean>
 */
export async function isAdmin(): Promise<boolean> {
	const session = await getSession()
	return session?.role === 'admin'
}

const DefaultFallback = () => (
	<div className="p-4 border border-red-500/20 rounded-lg">
		<h2 className="text-red-500 font-semibold">Access Denied</h2>
		<p className="text-neutral-400">
			You need administrator privileges to view this content
		</p>
	</div>
)

/**
 * HOC to protect server components with admin access
 * @param Component The component to protect
 * @param props Props to pass to the component
 * @param fallback Optional fallback component for non-admin users
 * @returns Promise<ReactNode>
 */
export async function withAdminProtection<T extends object>(
	Component: ComponentType<T>,
	props: T,
	fallback: ReactNode = <DefaultFallback />
): Promise<ReactNode> {
	const adminStatus = await isAdmin()

	if (!adminStatus) {
		return fallback
	}

	return <Component {...props} />
}
/////
