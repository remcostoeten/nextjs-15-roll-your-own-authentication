'use client'

import { DashboardHeader } from '@/components/dashboard'
import { checkAuthQuery } from '@/server/queries/check-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Dashboard layout with authentication protection
 * @author Remco Stoeten
 */
export default function DashboardLayout({
	children
}: {
	children: React.ReactNode
}) {
	const router = useRouter()

	useEffect(() => {
		const checkAuth = async () => {
			const { authenticated } = await checkAuthQuery()

			if (!authenticated) {
				router.push('/login')
			}
		}

		checkAuth()
	}, [router])

	return (
		<div className="min-h-screen bg-background">
			<DashboardHeader />
			<main className="container mx-auto px-4 py-8">{children}</main>
		</div>
	)
}
