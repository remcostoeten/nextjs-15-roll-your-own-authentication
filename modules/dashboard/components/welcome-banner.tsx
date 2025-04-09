'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getGreeting } from '@/utilities/utils'
import { Bell, Calendar, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

type TProps = {
	user: {
		firstName?: string
		lastName?: string
		email: string
		id: string
		avatar?: string
	}
	stats: {
		totalUsers?: number
		totalActivities?: number
		unreadNotifications?: number
		sessionCount?: number
		memberSince?: Date
		daysSinceJoined?: number
	}
}

export function WelcomeBanner({ user, stats }: TProps) {
	const [greeting, setGreeting] = useState('')
	const router = useRouter()

	// Update greeting every minute to handle time changes
	useEffect(() => {
		const updateGreeting = () => {
			// Use firstName if available, otherwise use "there" as a fallback
			const name = user.firstName || 'there'
			setGreeting(getGreeting(name))
		}

		updateGreeting()
		const interval = setInterval(updateGreeting, 60000)

		return () => clearInterval(interval)
	}, [user.firstName])

	const today = new Date()
	const formattedDate = today.toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})

	const initials = `${user.firstName?.[0] || ''}${
		user.lastName?.[0] || ''
	}`.toUpperCase()

	return (
		<Card className="bg-gradient-to-r from-neutral-900 to-neutral-800">
			<CardContent className="p-6">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center">
					<div className="flex items-center gap-4">
						<Avatar className="h-16 w-16 rounded-lg">
							{user.avatar ? (
								<AvatarImage
									src={user.avatar}
									alt={`${user.firstName} ${user.lastName}`}
									className="object-cover"
								/>
							) : (
								<AvatarFallback className="rounded-lg bg-emerald-500 text-emerald-950 text-lg">
									{initials}
								</AvatarFallback>
							)}
						</Avatar>
						<div className="space-y-2">
							<h2 className="text-3xl font-bold">{greeting}</h2>
							<p className="text-neutral-300 flex items-center">
								<Calendar className="mr-2 h-4 w-4" />
								{formattedDate}
							</p>
							{stats.daysSinceJoined !== undefined && (
								<p className="text-neutral-300 text-sm">
									Member for {stats.daysSinceJoined} days
								</p>
							)}
						</div>
					</div>

					<div className="flex flex-wrap gap-4 mt-4 md:mt-0">
						{stats.unreadNotifications !== undefined && (
							<Button
								variant="outline"
								onClick={() =>
									router.push('/dashboard/notifications')
								}
							>
								<Bell className="mr-2 h-4 w-4" />
								{stats.unreadNotifications} Unread Notifications
							</Button>
						)}

						<Button
							variant="outline"
							onClick={() =>
								router.push('/dashboard/user/profile')
							}
						>
							<Settings className="mr-2 h-4 w-4" />
							Profile Settings
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
