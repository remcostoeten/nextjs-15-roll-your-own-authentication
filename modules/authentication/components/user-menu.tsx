'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Icons } from '@/components/icons'
import { logout } from '../api/mutations'
import { customToast } from '@/components/ui/custom-toast'

interface UserMenuProps {
	user: {
		firstName: string
		lastName: string
		email: string
		avatar?: string
	}
}

export function UserMenu({ user }: UserMenuProps) {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)

	const handleLogout = async () => {
		try {
			setIsLoading(true)
			const result = await logout()

			if (result.success) {
				customToast.success({
					title: 'Logged out successfully',
					description: 'You have been logged out of your account.',
				})
				router.push('/login')
				router.refresh()
			} else {
				customToast.error({
					title: 'Logout failed',
					description: result.error || 'Something went wrong.',
				})
			}
		} catch (error) {
			console.error('Logout error:', error)
			customToast.error({
				title: 'Logout failed',
				description: 'An unexpected error occurred.',
			})
		} finally {
			setIsLoading(false)
		}
	}

	const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="relative h-10 w-10 rounded-full"
				>
					<Avatar className="h-10 w-10">
						<AvatarImage
							src={user.avatar}
							alt={`${user.firstName} ${user.lastName}`}
						/>
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-56"
				align="end"
				forceMount
			>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">{`${user.firstName} ${user.lastName}`}</p>
						<p className="text-xs leading-none text-muted-foreground">
							{user.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<Link href="/profile">
							<Icons.user className="mr-2 h-4 w-4" />
							<span>Profile</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/settings">
							<Icons.settings className="mr-2 h-4 w-4" />
							<span>Settings</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/notifications">
							<Icons.bell className="mr-2 h-4 w-4" />
							<span>Notifications</span>
							<span className="ml-auto bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
								3
							</span>
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="text-red-600 focus:text-red-600"
					disabled={isLoading}
					onSelect={(event) => {
						event.preventDefault()
						handleLogout()
					}}
				>
					{isLoading ? (
						<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
					) : (
						<Icons.logout className="mr-2 h-4 w-4" />
					)}
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
