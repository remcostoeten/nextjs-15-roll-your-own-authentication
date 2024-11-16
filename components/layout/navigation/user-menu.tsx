'use client'

import { useToast } from '@/components/primitives/toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/features/authentication/context/auth-context'
import { logout } from '@/features/authentication/mutations/logout'
import { LogOut, Settings, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Props = {
	user: {
		email: string | null
		role: 'user' | 'admin'
		avatarUrl: string | null
	}
}

export default function UserMenu({ user }: Props) {
	const router = useRouter()
	const { refetchUser } = useAuth()
	const toast = useToast()
	const [isLoading, setIsLoading] = useState(false)
	const initials = user.email?.slice(0, 2).toUpperCase() || ''

	const handleSignOut = async () => {
		try {
			setIsLoading(true)
			const result = await logout()
			
			if (result.success) {
				await refetchUser() // Refresh auth state
				toast.success('Signed out successfully')
				router.push('/login')
				router.refresh()
			} else {
				toast.error('Failed to sign out. Please try again.')
			}
		} catch (error) {
			console.error('Logout error:', error)
			toast.error('Something went wrong while signing out')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="relative h-8 w-8 rounded-full"
				>
					<Avatar className="h-8 w-8">
						<AvatarImage
							src={user.avatarUrl || ''}
							alt={user.email || ''}
						/>
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">
							{user.email}
						</p>
						<p className="text-xs leading-none text-muted-foreground">
							{user.role || 'User'}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<Link href="/profile" className="cursor-pointer">
							<User className="mr-2 h-4 w-4" />
							Profile
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/settings" className="cursor-pointer">
							<Settings className="mr-2 h-4 w-4" />
							Settings
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="cursor-pointer text-red-600 focus:text-red-600"
					onClick={handleSignOut}
					disabled={isLoading}
				>
					<span className='flex items-center gap-2'>
						<LogOut className="mr-2 h-4 w-4" />
						{isLoading ? 'Signing out...' : 'Sign out'}
					</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
