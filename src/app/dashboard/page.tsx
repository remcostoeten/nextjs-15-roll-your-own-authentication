'use client'

import { showToast } from '@/lib/toast'
import { getUserMutation } from '@/mutations/user'
import Spinner from '@/shared/ui/spinner'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
type UserData = {
	id: number
	email: string
	role: string
	avatar?: string | null
}

/**
 * Dashboard page showing user data and activity
 * @author Remco Stoeten
 */
export default function DashboardPage() {
	const [userData, setUserData] = useState<UserData | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const router = useRouter()

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const result = await getUserMutation()

				if (!result.success || !result.user) {
					throw new Error(result.error || 'Failed to fetch user data')
				}

				setUserData(result.user)
			} catch (error) {
				showToast.error('Please log in to access the dashboard')
				router.push('/login')
			} finally {
				setIsLoading(false)
			}
		}

		fetchUserData()
	}, [router])

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<Spinner size="lg" />
			</div>
		)
	}

	if (!userData) {
		return null
	}

	return (
		<div className="space-y-8">
			<div className="flex items-center space-x-4">
				{userData.avatar && (
					<img
						src={userData.avatar}
						alt={userData.email}
						className="w-16 h-16 rounded-full"
					/>
				)}
				<div>
					<h1 className="text-2xl font-bold">{userData.email}</h1>
					<p className="text-muted-foreground">
						Role: {userData.role}
					</p>
				</div>
			</div>
		</div>
	)
}
