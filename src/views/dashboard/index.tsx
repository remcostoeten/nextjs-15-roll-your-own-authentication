'use client'

import { useEffect } from 'react'
import { useAuth } from '@/modules/authentication/hooks/use-auth'
import { useUserMetrics } from '@/modules/user-metrics/hooks'
import { useRouter } from 'next/navigation'
import { Card, Separator } from 'ui'
import { Skeleton } from 'ui'
import type { User } from '@/modules/authentication/state/use-auth-state'
import { usePermissions } from '@/modules/authentication/hooks/use-permissions'
import Link from 'next/link'
import { IconBuildingBank, IconCalendarTime, IconId, IconLocation, IconMail, IconUserCircle, IconUserShield } from '@tabler/icons-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/components/ui/avatar'

interface DashboardProps {
	user: {
		id: string
		email: string
		firstName: string
		lastName: string
		role: string
		location: string
		timezone: string
		createdAt: string
		lastLogin: string | null
		avatarUrl?: string
	}
}

const adminRoutes = [
	{ href: '/dashboard/admin', label: 'Admin Overview', icon: IconBuildingBank },
	{ href: '/admin/roadmap', label: 'Roadmap Management', icon: IconCalendarTime },
]

export default function DashboardView({ user }: DashboardProps) {
	const { isAdmin } = usePermissions()
	const { isLoading, logout } = useAuth()
	const metrics = useUserMetrics()
	const router = useRouter()

	useEffect(() => {
		if (!isLoading && !user) {
			router.push('/login?callbackUrl=/dashboard')
		}
	}, [user, isLoading, router])

	const handleLogout = async () => {
		try {
			await logout()
			router.push('/')
		} catch (error) {
			console.error('Logout failed:', error)
		}
	}

	if (isLoading || metrics.isLoading) {
		return <LoadingState />
	}

	if (!user) {
		return <LoadingState />
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-6">
			<div className="max-w-7xl mx-auto space-y-8">
				{/* Header Section */}
				<div className="flex items-start justify-between">
					<div className="flex items-center space-x-6">
						<Avatar className="w-24 h-24 rounded-full border-4 border-primary/10">
							<AvatarImage
								src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName} ${user.lastName}`}
								alt={`${user.firstName}'s avatar`}
							/>
							<AvatarFallback>
								{user.firstName?.[0]}{user.lastName?.[0]}
							</AvatarFallback>
						</Avatar>
						<div>
							<h1 className="text-4xl font-bold text-foreground">
								{user.firstName} {user.lastName}
							</h1>
							<div className="flex items-center mt-2 text-muted-foreground">
								<IconUserShield className="w-5 h-5 mr-2" />
								<span className="capitalize">{user.role}</span>
							</div>
						</div>
					</div>
					
					{isAdmin && (
						<Card className="p-4">
							<h3 className="font-semibold mb-3 text-foreground">Admin Quick Access</h3>
							<div className="space-y-2">
								{adminRoutes.map((route) => (
									<Link
										key={route.href}
										href={route.href}
										className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-colors"
									>
										<route.icon className="w-5 h-5" />
										<span>{route.label}</span>
									</Link>
								))}
							</div>
						</Card>
					)}
				</div>

				<Separator />

				{/* User Details Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<Card className="p-6 space-y-4">
						<div className="flex items-center space-x-3">
							<IconId className="w-5 h-5 text-primary" />
							<h3 className="font-semibold">User ID</h3>
						</div>
						<p className="text-sm text-muted-foreground font-mono">{user.id}</p>
					</Card>

					<Card className="p-6 space-y-4">
						<div className="flex items-center space-x-3">
							<IconMail className="w-5 h-5 text-primary" />
							<h3 className="font-semibold">Email</h3>
						</div>
						<p className="text-sm text-muted-foreground">{user.email}</p>
					</Card>

					<Card className="p-6 space-y-4">
						<div className="flex items-center space-x-3">
							<IconLocation className="w-5 h-5 text-primary" />
							<h3 className="font-semibold">Location</h3>
						</div>
						<p className="text-sm text-muted-foreground">{user.location || 'Not specified'}</p>
					</Card>

					<Card className="p-6 space-y-4">
						<div className="flex items-center space-x-3">
							<IconCalendarTime className="w-5 h-5 text-primary" />
							<h3 className="font-semibold">Timezone</h3>
						</div>
						<p className="text-sm text-muted-foreground">{user.timezone}</p>
					</Card>

					<Card className="p-6 space-y-4">
						<div className="flex items-center space-x-3">
							<IconUserCircle className="w-5 h-5 text-primary" />
							<h3 className="font-semibold">Member Since</h3>
						</div>
						<p className="text-sm text-muted-foreground">
							{new Date(user.createdAt).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})}
						</p>
					</Card>

					<Card className="p-6 space-y-4">
						<div className="flex items-center space-x-3">
							<IconCalendarTime className="w-5 h-5 text-primary" />
							<h3 className="font-semibold">Last Login</h3>
						</div>
						<p className="text-sm text-muted-foreground">
							{user.lastLogin
								? new Date(user.lastLogin).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
									hour: '2-digit',
									minute: '2-digit',
								})
								: 'Never'}
						</p>
					</Card>
				</div>
			</div>
		</div>
	)
}

function LoadingState() {
	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto py-8 px-4">
				<div className="space-y-8">
					<Skeleton className="h-8 w-48" />
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						<Skeleton className="h-[300px] rounded-lg" />
						<Skeleton className="h-[300px] rounded-lg" />
						<Skeleton className="h-[300px] rounded-lg" />
					</div>
				</div>
			</div>
		</div>
	)
}
