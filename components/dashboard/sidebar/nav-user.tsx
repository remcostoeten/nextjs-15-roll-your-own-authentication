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
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

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
	const [user, setUser] = useState<UserData | null>(null)
	const [sessionData, setSessionData] = useState<SessionData | null>(null)
	const [notificationsData, setNotificationsData] =
		useState<NotificationsResponse | null>(null)
	const [isLoading, setIsLoading] = useState(true)

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
						</DropdownMenuLabel>
						{user.isAdmin && (
							<>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem>
										<Shield className="mr-2 h-4 w-4 text-emerald-500" />
										Admin Dashboard
									</DropdownMenuItem>
								</DropdownMenuGroup>
							</>
						)}
						<DropdownMenuSeparator />
						{/* Notifications Section */}
						<DropdownMenuSub>
							<DropdownMenuSubTrigger className="flex items-center justify-between">
								<div className="flex items-center relative">
									<Bell className="mr-3 ∫h-4 w-4" />
									<span>Notifications </span>
									{notificationsData?.unreadCount &&
										notificationsData.unreadCount > 0 && (
											<span className="flex h-2 w-2 items-center opacity-50 justify-center">
												<span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
											</span>
										)}
								</div>
							</DropdownMenuSubTrigger>
							<DropdownMenuSubContent className="w-72 p-0">
								{!notificationsData ||
								notificationsData.notifications.length === 0 ? (
									<div className="flex flex-col items-center justify-center py-8 px-4">
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted mb-3">
											<BellOff className="h-5 w-5 text-muted-foreground" />
										</div>
										<p className="text-xs text-center text-muted-foreground max-w-[200px]">
											No notifications yet. We'll notify
											you when something important
											happens.
										</p>
										<a
											href="/dashboard/notifications"
											className="mt-4 text-xs text-emerald-500 hover:text-emerald-600 font-medium flex items-center"
										>
											<span>View all notifications</span>
											<ExternalLink className="ml-1 h-3 w-3" />
										</a>
									</div>
								) : (
									<div className="max-h-[300px] overflow-y-auto">
										{notificationsData.notifications.map(
											(notification) => (
												<div
													key={notification.id}
													className={cn(
														'flex cursor-pointer items-start gap-3 p-3 hover:bg-muted/50 transition-colors',
														!notification.isRead &&
															'bg-muted/30 border-l-2 border-emerald-500'
													)}
													onClick={() => {
														if (notification.link) {
															window.location.href =
																notification.link
														}
													}}
												>
													<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
														{getNotificationIcon(
															notification.type
														)}
													</div>
													<div className="flex-1 min-w-0">
														<div className="flex items-center justify-between">
															<p className="font-medium text-sm truncate">
																{
																	notification.title
																}
															</p>
															{notification.link && (
																<ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0 ml-1" />
															)}
														</div>
														<p className="line-clamp-2 text-xs text-muted-foreground mt-1">
															{
																notification.content
															}
														</p>
														<div className="mt-1 flex items-center text-xs text-muted-foreground">
															<span>
																{formatDistanceToNow(
																	new Date(
																		notification.createdAt
																	),
																	{
																		addSuffix:
																			true,
																	}
																)}
															</span>
															{!notification.isRead && (
																<>
																	<span className="mx-1.5">
																		•
																	</span>
																	<span className="font-medium text-emerald-500">
																		New
																	</span>
																</>
															)}
														</div>
													</div>
												</div>
											)
										)}

										<div className="border-t border-border p-2">
											<Link
												href="/dashboard/notifications"
												className="flex items-center justify-center gap-1 w-full text-center text-xs py-2 text-emerald-500 hover:text-emerald-600 font-medium transition-colors"
											>
												<span>
													View all notifications
												</span>
												<ExternalLink className="h-3 w-3" />
											</Link>
										</div>
									</div>
								)}
							</DropdownMenuSubContent>
						</DropdownMenuSub>
						{sessionData && (
							<>
								<DropdownMenuSeparator />
								<div className="px-4 py-2 text-xs text-muted-foreground">
									<div className="flex items-center justify-between">
										<span>Last sign in</span>
										<span>
											{formatDistanceToNow(
												sessionData.lastSignIn,
												{ addSuffix: true }
											)}
										</span>
									</div>
									<div className="flex items-center justify-between mt-1">
										<span>IP address</span>
										<span>{sessionData.lastIp}</span>
									</div>
									<div className="flex items-center justify-between mt-1">
										<span>Sign in count</span>
										<span>{sessionData.signInCount}</span>
									</div>
								</div>
							</>
						)}
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<User className="mr-2 h-4 w-4" />
								Profile
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings className="mr-2 h-4 w-4" />
								Settings
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Button
								variant="ghost"
								onClick={logout}
								className="w-full justify-start text-destructive"
							>
								<LogOut className="mr-2 h-4 w-4" />
								Log out
							</Button>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
