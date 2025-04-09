'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
	ClipboardCopy,
	Users,
	Calendar,
	Clock,
	Activity,
	Lock,
	ExternalLink,
} from 'lucide-react'
import type { User as UserType } from '@/server/db'
import { EditPersonalInfoForm } from './edit-personal-info-form'
import { EditContactInfoForm } from './edit-contact-info-form'
import { EditUsernameForm } from './edit-username-form'
import Link from 'next/link'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatDistanceToNow } from 'date-fns'

type UserProfileProps = {
	user: UserType
	sessionData: {
		lastIp: string
		signInCount: number
		lastSignIn: Date
	}
}

export function UserProfile({ user, sessionData }: UserProfileProps) {
	const firstName = user.firstName || ''
	const lastName = user.lastName || ''
	const username = user.username || 'User'

	const fullName = `${firstName} ${lastName}`.trim() || username

	let initials = 'U'
	if (fullName && typeof fullName === 'string') {
		const parts = fullName.split(' ').filter(Boolean)
		if (parts.length > 0) {
			initials = parts
				.map((name) => name[0] || '')
				.join('')
				.toUpperCase()
				.substring(0, 2)
		} else if (username) {
			initials = username.substring(0, 2).toUpperCase()
		}
	}

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			hour12: true,
		}).format(date)
	}

	const signUpDate = formatDate(user.createdAt)
	const lastUpdated = formatDate(user.updatedAt)
	const lastSignIn = formatDate(sessionData.lastSignIn)

	function getTimeSince(date: Date) {
		return formatDistanceToNow(date, { addSuffix: true })
	}

	const lastSignInRelative = getTimeSince(sessionData.lastSignIn)
	const createdAtRelative = getTimeSince(user.createdAt)
	const updatedAtRelative = getTimeSince(user.updatedAt)

	return (
		<div className="container flex-1 space-y-8 px-4 py-8 sm:px-6 lg:px-8">
			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				<Button
					variant="ghost"
					size="sm"
					asChild
					className="h-7 gap-1 text-muted-foreground hover:text-foreground"
				>
					<Link href="/dashboard">
						<Users className="h-4 w-4" />
						Dashboard
					</Link>
				</Button>
				<span>/</span>
				<span>Profile</span>
				<span>/</span>
				<span className="font-medium text-foreground">{fullName}</span>
			</div>

			<div className="grid gap-6 md:grid-cols-7">
				{/* Left column - User summary */}
				<div className="md:col-span-2 space-y-6">
					<Card>
						<CardContent className="p-6">
							<div className="flex flex-col items-center text-center">
								<Avatar className="h-24 w-24 border-4 border-background">
									{user.avatar ? (
										<AvatarImage
											src={user.avatar}
											alt={fullName}
											className="object-cover"
										/>
									) : null}
									<AvatarFallback className="text-xl bg-primary text-primary-foreground">
										{initials}
									</AvatarFallback>
								</Avatar>

								<h2 className="mt-4 text-xl font-semibold">
									{fullName}
								</h2>
								<p className="text-sm text-muted-foreground">
									{user.email}
								</p>

								<div className="mt-2 flex items-center gap-2">
									<Badge
										variant={
											user.isActive
												? 'default'
												: 'secondary'
										}
									>
										{user.isActive ? 'Active' : 'Inactive'}
									</Badge>
									{user.isAdmin && (
										<Badge
											variant="outline"
											className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800"
										>
											Admin
										</Badge>
									)}
								</div>

								<Separator className="my-4" />

								<div className="w-full space-y-3 text-sm">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2 text-muted-foreground">
											<Calendar className="h-4 w-4" />
											<span>Member since</span>
										</div>
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<span className="font-medium">
														{createdAtRelative}
													</span>
												</TooltipTrigger>
												<TooltipContent>
													<p>{signUpDate}</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</div>

									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2 text-muted-foreground">
											<Clock className="h-4 w-4" />
											<span>Last sign in</span>
										</div>
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<span className="font-medium">
														{lastSignInRelative}
													</span>
												</TooltipTrigger>
												<TooltipContent>
													<p>{lastSignIn}</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</div>

									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2 text-muted-foreground">
											<Activity className="h-4 w-4" />
											<span>Sign in count</span>
										</div>
										<span className="font-medium">
											{sessionData.signInCount}
										</span>
									</div>
								</div>

								<Separator className="my-4" />

								<div className="grid w-full grid-cols-2 gap-2">
									<Button
										variant="outline"
										size="sm"
										asChild
									>
										<Link href="/dashboard">
											<Users className="mr-2 h-4 w-4" />
											Dashboard
										</Link>
									</Button>
									<Button
										variant="outline"
										size="sm"
										asChild
									>
										<Link href="/dashboard/settings">
											<Lock className="mr-2 h-4 w-4" />
											Security
										</Link>
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">User ID</CardTitle>
							<CardDescription>
								Your unique identifier
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2">
								<code className="text-xs text-muted-foreground">
									{user.id}
								</code>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8"
												onClick={() => {
													navigator.clipboard.writeText(
														user.id
													)
												}}
											>
												<ClipboardCopy className="h-4 w-4" />
												<span className="sr-only">
													Copy ID
												</span>
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>Copy to clipboard</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Right column - Tabs with forms */}
				<div className="md:col-span-5">
					<Tabs
						defaultValue="personal"
						className="w-full"
					>
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="personal">
								Personal Info
							</TabsTrigger>
							<TabsTrigger value="contact">
								Contact Info
							</TabsTrigger>
							<TabsTrigger value="account">Account</TabsTrigger>
						</TabsList>

						<TabsContent
							value="personal"
							className="mt-6"
						>
							<Card>
								<CardHeader>
									<CardTitle className="text-xl">
										Personal Information
									</CardTitle>
									<CardDescription>
										Update your personal details
									</CardDescription>
								</CardHeader>
								<CardContent>
									<EditPersonalInfoForm user={user} />
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent
							value="contact"
							className="mt-6"
						>
							<Card>
								<CardHeader>
									<CardTitle className="text-xl">
										Contact Information
									</CardTitle>
									<CardDescription>
										Manage your contact details
									</CardDescription>
								</CardHeader>
								<CardContent>
									<EditContactInfoForm user={user} />
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent
							value="account"
							className="mt-6 space-y-6"
						>
							<Card>
								<CardHeader>
									<CardTitle className="text-xl">
										Account Settings
									</CardTitle>
									<CardDescription>
										Update your username and account
										preferences
									</CardDescription>
								</CardHeader>
								<CardContent>
									<EditUsernameForm user={user} />
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-base">
										User Claims
									</CardTitle>
									<CardDescription>
										JWT claims associated with your account
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="rounded-md bg-background xxx p-4 overflow-x-auto">
										<pre className="text-xs text-green-500">
											<code>
												{`{
  "email": "${user.email}",
  "email_verified": true,
  "sub": "${user.id}",
  "role": "${user.isAdmin ? 'admin' : 'user'}",
  "username": "${user.username || ''}",
  "iat": ${Math.floor(Date.now() / 1000)},
  "exp": ${Math.floor(Date.now() / 1000) + 3600}
}`}
											</code>
										</pre>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-base">
										Connected Providers
									</CardTitle>
									<CardDescription>
										External authentication providers linked
										to your account
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="flex items-center justify-between rounded-lg border p-4">
											<div className="flex items-center gap-3">
												<div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
													<svg
														className="h-5 w-5"
														viewBox="0 0 24 24"
														fill="currentColor"
													>
														<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
													</svg>
												</div>
												<div>
													<h4 className="text-sm font-medium">
														GitHub
													</h4>
													<p className="text-xs text-muted-foreground">
														Not connected
													</p>
												</div>
											</div>
											<Button
												variant="outline"
												size="sm"
											>
												Connect
												<ExternalLink className="ml-2 h-3.5 w-3.5" />
											</Button>
										</div>

										<div className="flex items-center justify-between rounded-lg border p-4">
											<div className="flex items-center gap-3">
												<div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
													<svg
														className="h-5 w-5"
														viewBox="0 0 24 24"
														fill="currentColor"
													>
														<path
															d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
															fill="#4285F4"
														/>
														<path
															d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
															fill="#34A853"
														/>
														<path
															d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
															fill="#FBBC05"
														/>
														<path
															d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
															fill="#EA4335"
														/>
													</svg>
												</div>
												<div>
													<h4 className="text-sm font-medium">
														Google
													</h4>
													<p className="text-xs text-muted-foreground">
														Not connected
													</p>
												</div>
											</div>
											<Button
												variant="outline"
												size="sm"
											>
												Connect
												<ExternalLink className="ml-2 h-3.5 w-3.5" />
											</Button>
										</div>

										<div className="flex items-center justify-between rounded-lg border p-4">
											<div className="flex items-center gap-3">
												<div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
													<svg
														className="h-5 w-5"
														viewBox="0 0 24 24"
														fill="currentColor"
													>
														<path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
													</svg>
												</div>
												<div>
													<h4 className="text-sm font-medium">
														Discord
													</h4>
													<p className="text-xs text-muted-foreground">
														Not connected
													</p>
												</div>
											</div>
											<Button
												variant="outline"
												size="sm"
											>
												Connect
												<ExternalLink className="ml-2 h-3.5 w-3.5" />
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-base">
										Session Information
									</CardTitle>
									<CardDescription>
										Details about your current and past
										sessions
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
											<div className="rounded-lg border p-4">
												<h4 className="text-sm font-medium">
													Last IP Address
												</h4>
												<p className="mt-1 font-mono text-sm">
													{sessionData.lastIp}
												</p>
											</div>

											<div className="rounded-lg border p-4">
												<h4 className="text-sm font-medium">
													Last Updated
												</h4>
												<Tooltip>
													<TooltipTrigger asChild>
														<p className="mt-1 text-sm">
															{updatedAtRelative}
														</p>
													</TooltipTrigger>
													<TooltipContent>
														<p>{lastUpdated}</p>
													</TooltipContent>
												</Tooltip>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	)
}
