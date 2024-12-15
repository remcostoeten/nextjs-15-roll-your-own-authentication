'use client'

import React, { Suspense, useState } from 'react'
import {
	LogOut,
	Settings,
	UserCircle,
	ChevronDown,
	Github,
	Mail
} from 'lucide-react'
import { FancyButton } from '@/shared/components/ui/fancy-btn'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/shared/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { useUser } from '@/contexts/user-context'
import { cn } from '@/shared/helpers/utils'
import { toast } from 'sonner'
import { oauthLogin } from '@/server/mutations'
import type { OAuthProvider } from '@/server/mutations'
import Image from 'next/image'
import Spinner from '@/shared/components/effects/spinner'

type User = {
	id: number
	email: string
	firstName: string | null
	lastName: string | null
	name: string | null
	image: string | null
	provider: string | null
}

type UserMenuProps = {
	user: User
}

export default function UserMenu({ user }: UserMenuProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [loadingProvider, setLoadingProvider] =
		useState<OAuthProvider | null>(null)
	const router = useRouter()
	const { logout } = useUser()

	const handleLogout = async () => {
		try {
			await logout()
		} catch (error) {
			console.error('Logout failed:', error)
		}
	}

	const handleOAuthLogin = async (provider: OAuthProvider) => {
		if (loadingProvider) return
		try {
			setLoadingProvider(provider)
			const toastId = toast.loading(`Connecting to ${provider}...`)

			const result = await oauthLogin(provider)

			if (!result.success || !result.redirectUrl) {
				toast.error(
					result.error || `Failed to connect to ${provider}`,
					{
						id: toastId,
						description: 'Please try again later'
					}
				)
				return
			}

			toast.success(`Redirecting to ${provider}...`, {
				id: toastId,
				duration: 2000
			})

			setTimeout(() => {
				window.location.href = result.redirectUrl as string
			}, 500)
		} catch (error) {
			console.error(`${provider} login failed:`, error)
			toast.error(`Failed to connect to ${provider}`, {
				description: 'An unexpected error occurred'
			})
		} finally {
			setLoadingProvider(null)
		}
	}

	if (user) {
		return (
			<Suspense fallback={<Spinner />}>
				<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
					<DropdownMenuTrigger asChild>
						<div className="relative">
							<FancyButton variant="dark">
								<div className="flex items-center gap-2">
									{user.image ? (
										<Image
											width={24}
											height={24}
											src={user.image}
											alt={user.name || 'User'}
											className="w-6 h-6 rounded-full ring-1 ring-[rgb(255_255_255_/_8%)] shadow-inner"
										/>
									) : (
										<div className="w-6 h-6 rounded-full bg-[rgb(255_255_255_/_3%)] ring-1 ring-[rgb(255_255_255_/_8%)] flex items-center justify-center">
											<UserCircle className="w-4 h-4 text-[hsl(0deg_0%_76%)]" />
										</div>
									)}
									<span className="text-sm">
										{user.firstName ||
											user.email.split('@')[0]}
									</span>
									<ChevronDown
										className={cn(
											'w-3.5 h-3.5 text-[hsl(0deg_0%_66%)] transition-transform duration-200',
											isOpen && 'transform rotate-180'
										)}
									/>
								</div>
							</FancyButton>
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						className={cn(
							'w-64 p-2 mt-2',
							'bg-gradient-to-b from-[hsl(0deg_0%_12%)] to-[hsl(0deg_0%_8%)]',
							'border border-[rgb(255_255_255_/_5%)]',
							'shadow-[0_8px_32px_rgba(0,0,0,0.35)] rounded-lg',
							'backdrop-blur-sm backdrop-saturate-150',
							'animate-in fade-in-0 zoom-in-95 duration-200'
						)}
					>
						<div className="px-2 py-2 mb-1">
							<div className="flex items-center gap-3">
								{user.image ? (
									<Image
										width={40}
										height={40}
										src={user.image}
										alt={user.name || 'User'}
										className="w-10 h-10 rounded-full border border-[rgb(255_255_255_/_5%)] ring-1 ring-[rgb(255_255_255_/_8%)] shadow-inner"
									/>
								) : (
									<div className="w-10 h-10 rounded-full bg-[rgb(255_255_255_/_3%)] ring-1 ring-[rgb(255_255_255_/_8%)] flex items-center justify-center">
										<UserCircle className="w-6 h-6 text-[hsl(0deg_0%_76%)]" />
									</div>
								)}
								<div className="flex flex-col">
									<p className="text-sm font-medium text-[hsl(0deg_0%_86%)]">
										{user.firstName && user.lastName
											? `${user.firstName} ${user.lastName}`
											: user.email.split('@')[0]}
									</p>
									<p className="text-xs text-[hsl(0deg_0%_46%)]">
										{user.email}
									</p>
								</div>
							</div>
						</div>
						<DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-[rgb(255_255_255_/_8%)] to-transparent mx-1" />
						<div className="p-1">
							<DropdownMenuItem
								className={cn(
									'flex items-center gap-2 px-2 py-1.5 rounded-md',
									'text-xs text-[hsl(0deg_0%_76%)] hover:text-[hsl(0deg_0%_96%)]',
									'hover:bg-[rgb(255_255_255_/_4%)]',
									'cursor-pointer group',
									'transition-all duration-200 ease-out'
								)}
								onClick={() => router.push('/dashboard')}
							>
								<Settings className="w-3.5 h-3.5 group-hover:text-emerald-400 transition-colors" />
								<span>Dashboard</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={handleLogout}
								className={cn(
									'flex items-center gap-2 px-2 py-1.5 rounded-md mt-1',
									'text-xs text-red-400 hover:text-red-300',
									'hover:bg-[rgb(239_68_68_/_8%)]',
									'cursor-pointer group',
									'transition-all duration-200 ease-out'
								)}
							>
								<LogOut className="w-3.5 h-3.5 group-hover:text-red-300 transition-colors" />
								<span>Sign Out</span>
							</DropdownMenuItem>
						</div>
					</DropdownMenuContent>
				</DropdownMenu>
			</Suspense>
		)
	}

	return (
		<div className="flex items-center gap-2">
			<FancyButton
				variant="dark"
				onClick={() => router.push('/login')}
				className="px-4 py-2"
			>
				<div className="flex items-center gap-2">
					<Mail className="w-4 h-4" />
					<span className="text-sm">Sign in with Email</span>
				</div>
			</FancyButton>
			<FancyButton
				variant="dark"
				onClick={() => handleOAuthLogin('github')}
				className="px-4 py-2"
				disabled={loadingProvider !== null}
			>
				<div className="flex items-center gap-2">
					<Github
						className={cn(
							'w-4 h-4',
							loadingProvider === 'github' && 'animate-spin'
						)}
					/>
					<span className="text-sm">
						{loadingProvider === 'github'
							? 'Connecting...'
							: 'GitHub'}
					</span>
				</div>
			</FancyButton>
			<FancyButton
				variant="dark"
				onClick={() => handleOAuthLogin('google')}
				className="px-4 py-2"
				disabled={loadingProvider !== null}
			>
				<div className="flex items-center gap-2">
					<svg
						className={cn(
							'w-4 h-4',
							loadingProvider === 'google' && 'animate-spin'
						)}
						viewBox="0 0 24 24"
					>
						<path
							fill="currentColor"
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
						/>
						<path
							fill="currentColor"
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
						/>
						<path
							fill="currentColor"
							d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
						/>
						<path
							fill="currentColor"
							d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
						/>
					</svg>
					<span className="text-sm">
						{loadingProvider === 'google'
							? 'Connecting...'
							: 'Google'}
					</span>
				</div>
			</FancyButton>
		</div>
	)
}
