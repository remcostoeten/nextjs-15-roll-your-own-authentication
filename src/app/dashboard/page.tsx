'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/contexts/user-context'
import { toast } from 'sonner'
import Image from 'next/image'

export default function Dashboard() {
	const router = useRouter()
	const { user, isLoading } = useUser()

	useEffect(() => {
		if (!isLoading && !user) {
			toast.error('Please log in to access the dashboard')
			router.push('/login')
		}
	}, [user, isLoading, router])

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
			</div>
		)
	}

	if (!user) {
		return null
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen text-foreground">
			<div className="p-8 rounded-lg border border-border bg-card shadow-lg">
				<h1 className="mb-6 text-2xl font-bold">
					Welcome to your Dashboard
				</h1>
				<div className="space-y-4">
					<div className="flex items-center gap-4">
						{user.image ? (
							<Image
								width={64}
								height={64}
								src={user.image}
								alt={user.name || ''}
								className="w-16 h-16 rounded-full"
							/>
						) : (
							<div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
								<span className="text-xl font-semibold text-emerald-500">
									{user.firstName?.[0]}
									{user.lastName?.[0]}
								</span>
							</div>
						)}
						<div>
							<h2 className="text-xl font-semibold">
								{user.name}
							</h2>
							<p className="text-sm text-muted-foreground">
								{user.email}
							</p>
						</div>
					</div>
					<div className="pt-4 border-t border-border">
						<p className="text-sm text-muted-foreground">
							Signed in with {user.provider || 'Email/Password'}
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
