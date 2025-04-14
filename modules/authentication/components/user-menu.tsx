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
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	User,
	Settings,
	Bell,
	LogOut,
	Moon,
	Sun,
	Laptop,
	Command,
	Sparkles,
} from 'lucide-react'
import { logout } from '../api/mutations'
import { customToast } from '@/components/ui/custom-toast'
import { useTheme } from 'next-themes'

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
	const { setTheme } = useTheme()

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
					className="relative h-8 w-8 rounded-full"
				>
					<Avatar className="h-8 w-8">
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
							<User className="mr-2 h-4 w-4" />
							<span>Profile</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/settings">
							<Settings className="mr-2 h-4 w-4" />
							<span>Settings</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/notifications">
							<Bell className="mr-2 h-4 w-4" />
							<span>Notifications</span>
							<span className="ml-auto bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
								3
							</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/command">
							<Command className="mr-2 h-4 w-4" />
							<span>Command menu</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/previews">
							<Sparkles className="mr-2 h-4 w-4" />
							<span>Feature previews</span>
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<Moon className="mr-2 h-4 w-4" />
						<span>Appearance</span>
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						<DropdownMenuItem onClick={() => setTheme('light')}>
							<Sun className="mr-2 h-4 w-4" />
							<span>Light</span>
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setTheme('dark')}>
							<Moon className="mr-2 h-4 w-4" />
							<span>Dark</span>
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setTheme('system')}>
							<Laptop className="mr-2 h-4 w-4" />
							<span>System</span>
						</DropdownMenuItem>
					</DropdownMenuSubContent>
				</DropdownMenuSub>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="text-red-600 focus:text-red-600 cursor-pointer"
					disabled={isLoading}
					onSelect={(event) => {
						event.preventDefault()
						handleLogout()
					}}
				>
					{isLoading ? (
						<svg
							className="mr-2 h-4 w-4 animate-spin"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							></circle>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
					) : (
						<LogOut className="mr-2 h-4 w-4" />
					)}
					<span>Sign out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
