'use client'

import { useEffect, useState } from 'react'
import {
	Bell,
	ChevronsUpDown,
	LogOut,
	Settings,
	Shield,
	User,
	BellOff,
	Info,
	AlertCircle,
	AlertTriangle,
	ExternalLink,
	CheckCircle,
	Link,
	Loader2,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/dashboard/sidebar/sidebar'
import { getUserSessionData } from '@/modules/authentication/api/queries'
import { getUserNotifications } from '@/modules/notifications/api/queries'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { logout } from '@/modules/authentication/api/mutations'
import { notifications } from '@/server/db/schema'
import { UserNavLoader } from '@/components/loaders/user-nav.loader'
import { customToast } from '@/components/ui/custom-toast'

type UserData = {
	id: string
	email: string
	username: string
	firstName: string
	lastName: string
	isAdmin: boolean
	avatar?: string
}

type SessionData = {
	lastIp: string
	signInCount: number
	lastSignIn: Date
}

type Notification = {
	id: string
	title: string
	content: string
	type: 'info' | 'success' | 'warning' | 'error'
	createdAt: Date
	expiresAt?: Date
	link?: string
	isGlobal: boolean
	isRead: boolean
	readAt?: Date
	creator: {
		id: string
		firstName: string
		lastName: string
	}
}

type NotificationsResponse = {
	notifications: Notification[]
	unreadCount: number
	total: number
}

export function NavUser() {
	const { isMobile } = useSidebar()
	const router = useRouter()
	const [user, setUser] = useState<UserData | null>(null)
	const [sessionData, setSessionData] = useState<SessionData | null>(null)
	const [notificationsData, setNotificationsData] =
		useState<NotificationsResponse | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isLoggingOut, setIsLoggingOut] = useState(false)

	const fetchUserData = async () => {
		try {
			const userData = (window as any).__user || null
			setUser(userData)

			if (userData) {
				const sessionInfo = await getUserSessionData()
				if (sessionInfo) {
					setSessionData({
						lastIp: sessionInfo.lastIp,
						signInCount: sessionInfo.signInCount,
						lastSignIn: new Date(sessionInfo.lastSignIn),
					})
				}

				const notifications = await getUserNotifications(5, 0)
				setNotificationsData(notifications as NotificationsResponse)
			}
		} catch (error) {
			console.error('Error fetching user data:', error)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchUserData()

		// Refresh notifications every minute
		const interval = setInterval(() => {
			if (user) {
				getUserNotifications(5, 0).then((notifications) =>
					setNotificationsData(notifications as NotificationsResponse)
				)
			}
		}, 60000)

		return () => clearInterval(interval)
	}, [user])

	const getNotificationIcon = (type: string) => {
		switch (type) {
			case 'info':
				return <Info className="h-4 w-4 text-blue-500" />
			case 'success':
				return <CheckCircle className="h-4 w-4 text-emerald-500" />
			case 'warning':
				return <AlertTriangle className="h-4 w-4 text-amber-500" />
			case 'error':
				return <AlertCircle className="h-4 w-4 text-rose-500" />
			default:
				return <Info className="h-4 w-4 text-blue-500" />
		}
	}

	const handleLogout = async () => {
		try {
			setIsLoggingOut(true)
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
			setIsLoggingOut(false)
		}
	}

	if (isLoading) {
		return <UserNavLoader />
	}

	if (!user) {
		return (
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton
						size="lg"
						asChild
					>
						<a href="/login">
							<User className="text-emerald-500" />
							<span>Sign In</span>
						</a>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		)
	}

	const fullName = `${user.firstName} ${user.lastName}`
	const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(
		0
	)}`.toUpperCase()
	const hasUnreadNotifications =
		notificationsData?.unreadCount && notificationsData.unreadCount > 0

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<div className="relative">
								<Avatar className="h-8 w-8 rounded-lg">
									{user.avatar ? (
										<AvatarImage
											src={user.avatar}
											alt={fullName}
											className="object-cover"
										/>
									) : (
										<AvatarImage
											src={`https://avatar.vercel.sh/${user.username}`}
											alt={fullName}
										/>
									)}
									<AvatarFallback className="rounded-lg bg-emerald-500 text-emerald-950">
										{initials}
									</AvatarFallback>
								</Avatar>
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">
									{fullName}
								</span>
								<span className="truncate text-xs text-muted-foreground">
									{user.email}
								</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? 'bottom' : 'right'}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-4 py-3">
								<Avatar className="h-10 w-10 rounded-lg">
									{user.avatar ? (
										<AvatarImage
											src={user.avatar}
											alt={fullName}
											className="object-cover"
										/>
									) : (
										<AvatarImage
											src={`https://avatar.vercel.sh/${user.username}`}
											alt={fullName}
										/>
									)}
									<AvatarFallback className="rounded-lg bg-emerald-500 text-emerald-950">
										{initials}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">
										{fullName}
									</span>
									<span className="truncate text-xs text-muted-foreground">
										@{user.username}
									</span>
								</div>
								{user.isAdmin && (
									<Shield className="ml-auto h-4 w-4 text-emerald-500" />
								)}
							</div>
							{sessionData && (
								<div className="border-t px-4 py-2 text-xs text-muted-foreground">
									<p>
										Last sign in:{' '}
										{formatDistanceToNow(
											sessionData.lastSignIn
										)}{' '}
										ago
									</p>
									<p>IP: {sessionData.lastIp}</p>
								</div>
							)}
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem asChild>
								<a
									href="/profile"
									className="flex items-center"
								>
									<User className="mr-2 h-4 w-4" />
									<span>Profile</span>
								</a>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<a
									href="/settings"
									className="flex items-center"
								>
									<Settings className="mr-2 h-4 w-4" />
									<span>Settings</span>
								</a>
							</DropdownMenuItem>
							{user.isAdmin && (
								<DropdownMenuItem asChild>
									<a
										href="/admin"
										className="flex items-center"
									>
										<Shield className="mr-2 h-4 w-4" />
										<span>Admin Panel</span>
									</a>
								</DropdownMenuItem>
							)}
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuSub>
								<DropdownMenuSubTrigger className="flex items-center">
									<Bell className="mr-2 h-4 w-4" />
									<span>Notifications</span>
									{hasUnreadNotifications && (
										<span className="ml-auto flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
											{notificationsData.unreadCount}
										</span>
									)}
								</DropdownMenuSubTrigger>
								<DropdownMenuSubContent className="w-72">
									<div className="flex items-center justify-between px-2 py-1.5">
										<span className="text-xs font-semibold">
											Recent Notifications
										</span>
										<Button
											variant="ghost"
											size="icon"
											className="h-4 w-4"
											asChild
										>
											<a href="/notifications">
												<ExternalLink className="h-3 w-3" />
											</a>
										</Button>
									</div>
									<DropdownMenuSeparator />
									{notificationsData?.notifications.length ===
									0 ? (
										<div className="flex items-center gap-2 px-2 py-4 text-center text-sm text-muted-foreground">
											<BellOff className="mx-auto h-4 w-4" />
											<span>No notifications</span>
										</div>
									) : (
										notificationsData?.notifications.map(
											(notification) => (
												<DropdownMenuItem
													key={notification.id}
													className={cn(
														'flex items-start gap-2 p-2',
														!notification.isRead &&
															'bg-accent/40'
													)}
													asChild
												>
													<a
														href={
															notification.link ||
															'/notifications'
														}
														className="grid gap-1"
													>
														<div className="flex items-center gap-2">
															{getNotificationIcon(
																notification.type
															)}
															<span className="font-medium">
																{
																	notification.title
																}
															</span>
														</div>
														<div className="line-clamp-2 text-xs text-muted-foreground">
															{
																notification.content
															}
														</div>
														<div className="flex items-center gap-2 text-xs text-muted-foreground">
															<span>
																{formatDistanceToNow(
																	new Date(
																		notification.createdAt
																	)
																)}{' '}
																ago
															</span>
															{notification.link && (
																<>
																	<span>
																		•
																	</span>
																	<Link className="h-3 w-3" />
																</>
															)}
														</div>
													</a>
												</DropdownMenuItem>
											)
										)
									)}
								</DropdownMenuSubContent>
							</DropdownMenuSub>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="text-red-600 focus:bg-red-600/10 focus:text-red-600"
							disabled={isLoggingOut}
							onSelect={(event) => {
								event.preventDefault()
								handleLogout()
							}}
						>
							{isLoggingOut ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<LogOut className="mr-2 h-4 w-4" />
							)}
							<span>Log out</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
