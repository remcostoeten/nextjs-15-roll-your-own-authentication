'use client'

import { getSession } from '@/features/auth/session'
import React, { type ReactNode } from 'react'

type AdminProtectedProps = {
	[key: string]: unknown
}

type AdminProtectedComponent<T extends AdminProtectedProps> = {
	Component: React.ComponentType<T>
	props: T
	fallback?: ReactNode
}

/**
 * Server-side utility to check if the current user is an admin
 * @returns Promise<boolean>
 */
export async function isAdmin(): Promise<boolean> {
	const session = await getSession()
	return session?.role === 'admin'
}

/**
 * HOC to protect server components with admin access
 * @template T - Component props type
 * @param Component - The component to protect
 * @param props - Props to pass to the component
 * @param fallback - Optional fallback component for non-admin users
 */
export async function withAdminProtection<T extends AdminProtectedProps>({
	Component,
	props,
	fallback = <DefaultFallback />
}: AdminProtectedComponent<T>): Promise<ReactNode> {
	const adminStatus = await isAdmin()

	if (!adminStatus) {
		return fallback
	}

	return <Component {...props} />
}

function DefaultFallback(): JSX.Element {
	return (
		<div className="p-4 border border-red-500/20 rounded-lg">
			<h2 className="text-red-500 font-semibold">Access Denied</h2>
			<p className="text-neutral-400">
				You need administrator privileges to view this content
			</p>
		</div>
	)
}
