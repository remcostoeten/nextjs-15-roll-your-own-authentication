'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Badge } from '@/shared/ui/badge'
import { formatDistance } from 'date-fns'
import type { ProfileUser } from './profile'

type ProfileInfoProps = Pick<
	ProfileUser,
	'role' | 'createdAt' | 'name' | 'avatar'
>

export default function ProfileInfo({
	role,
	createdAt,
	name,
	avatar
}: ProfileInfoProps) {
	const memberSince = formatDistance(new Date(createdAt), new Date(), {
		addSuffix: true
	})

	const initials =
		name
			?.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase() || '?'

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Avatar className="h-20 w-20">
					<AvatarImage
						src={avatar ?? ''}
						alt={name ?? 'Profile picture'}
					/>
					<AvatarFallback>{initials}</AvatarFallback>
				</Avatar>

				<div className="space-y-1">
					<h1 className="text-2xl font-semibold">{name}</h1>
					<Badge variant="secondary" className="capitalize">
						{role.toLowerCase()}
					</Badge>
				</div>
			</div>

			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				<span>Member since:</span>
				<span>{memberSince}</span>
			</div>
		</div>
	)
}
