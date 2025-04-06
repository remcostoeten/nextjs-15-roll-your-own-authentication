'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/hooks/use-toast'
import {
	Bell,
	Mail,
	MessageSquare,
	Calendar,
	FileText,
	Save,
} from 'lucide-react'

interface NotificationSettingsProps {
	user: any
}

export function NotificationSettings({ user }: NotificationSettingsProps) {
	const [settings, setSettings] = useState({
		email: {
			all: true,
			mentions: true,
			comments: true,
			updates: false,
			reminders: true,
			marketing: false,
		},
		push: {
			all: true,
			mentions: true,
			comments: true,
			updates: true,
			reminders: true,
			marketing: false,
		},
		frequency: 'immediate',
	})

	const [isSaving, setIsSaving] = useState(false)

	const handleToggle = (category: 'email' | 'push', setting: string) => {
		setSettings((prev) => ({
			...prev,
			[category]: {
				...prev[category],
				[setting]:
					!prev[category][setting as keyof (typeof prev)[category]],
			},
		}))
	}

	const handleFrequencyChange = (frequency: string) => {
		setSettings((prev) => ({
			...prev,
			frequency,
		}))
	}

	const saveSettings = async () => {
		setIsSaving(true)

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000))

		setIsSaving(false)
		toast({
			title: 'Settings saved',
			description: 'Your notification preferences have been updated',
		})
	}

	return (
		<Tabs
			defaultValue="email"
			className="w-full"
		>
			<TabsList className="grid w-full grid-cols-2 mb-4">
				<TabsTrigger
					value="email"
					className="gap-2"
				>
					<Mail className="h-4 w-4" />
					Email Notifications
				</TabsTrigger>
				<TabsTrigger
					value="push"
					className="gap-2"
				>
					<Bell className="h-4 w-4" />
					Push Notifications
				</TabsTrigger>
			</TabsList>

			<TabsContent
				value="email"
				className="space-y-4"
			>
				<div className="grid gap-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
								<Bell className="h-4 w-4 text-primary" />
							</div>
							<div>
								<Label
									htmlFor="email-all"
									className="text-base"
								>
									All notifications
								</Label>
								<p className="text-sm text-muted-foreground">
									Receive all email notifications
								</p>
							</div>
						</div>
						<Switch
							id="email-all"
							checked={settings.email.all}
							onCheckedChange={() => handleToggle('email', 'all')}
						/>
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
								<MessageSquare className="h-4 w-4" />
							</div>
							<div>
								<Label
									htmlFor="email-mentions"
									className="text-base"
								>
									Mentions & Comments
								</Label>
								<p className="text-sm text-muted-foreground">
									When someone mentions or replies to you
								</p>
							</div>
						</div>
						<Switch
							id="email-mentions"
							checked={settings.email.mentions}
							onCheckedChange={() =>
								handleToggle('email', 'mentions')
							}
						/>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
								<FileText className="h-4 w-4" />
							</div>
							<div>
								<Label
									htmlFor="email-updates"
									className="text-base"
								>
									Updates & Changes
								</Label>
								<p className="text-sm text-muted-foreground">
									When important updates or changes occur
								</p>
							</div>
						</div>
						<Switch
							id="email-updates"
							checked={settings.email.updates}
							onCheckedChange={() =>
								handleToggle('email', 'updates')
							}
						/>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
								<Calendar className="h-4 w-4" />
							</div>
							<div>
								<Label
									htmlFor="email-reminders"
									className="text-base"
								>
									Reminders
								</Label>
								<p className="text-sm text-muted-foreground">
									For upcoming events and deadlines
								</p>
							</div>
						</div>
						<Switch
							id="email-reminders"
							checked={settings.email.reminders}
							onCheckedChange={() =>
								handleToggle('email', 'reminders')
							}
						/>
					</div>
				</div>
			</TabsContent>

			<TabsContent
				value="push"
				className="space-y-4"
			>
				<div className="grid gap-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
								<Bell className="h-4 w-4 text-primary" />
							</div>
							<div>
								<Label
									htmlFor="push-all"
									className="text-base"
								>
									All notifications
								</Label>
								<p className="text-sm text-muted-foreground">
									Receive all push notifications
								</p>
							</div>
						</div>
						<Switch
							id="push-all"
							checked={settings.push.all}
							onCheckedChange={() => handleToggle('push', 'all')}
						/>
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
								<MessageSquare className="h-4 w-4" />
							</div>
							<div>
								<Label
									htmlFor="push-mentions"
									className="text-base"
								>
									Mentions & Comments
								</Label>
								<p className="text-sm text-muted-foreground">
									When someone mentions or replies to you
								</p>
							</div>
						</div>
						<Switch
							id="push-mentions"
							checked={settings.push.mentions}
							onCheckedChange={() =>
								handleToggle('push', 'mentions')
							}
						/>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
								<FileText className="h-4 w-4" />
							</div>
							<div>
								<Label
									htmlFor="push-updates"
									className="text-base"
								>
									Updates & Changes
								</Label>
								<p className="text-sm text-muted-foreground">
									When important updates or changes occur
								</p>
							</div>
						</div>
						<Switch
							id="push-updates"
							checked={settings.push.updates}
							onCheckedChange={() =>
								handleToggle('push', 'updates')
							}
						/>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
								<Calendar className="h-4 w-4" />
							</div>
							<div>
								<Label
									htmlFor="push-reminders"
									className="text-base"
								>
									Reminders
								</Label>
								<p className="text-sm text-muted-foreground">
									For upcoming events and deadlines
								</p>
							</div>
						</div>
						<Switch
							id="push-reminders"
							checked={settings.push.reminders}
							onCheckedChange={() =>
								handleToggle('push', 'reminders')
							}
						/>
					</div>
				</div>
			</TabsContent>

			<Separator className="my-4" />

			<div className="space-y-4">
				<div>
					<h3 className="text-base font-medium mb-2">
						Notification Frequency
					</h3>
					<div className="grid grid-cols-3 gap-2">
						<Button
							variant={
								settings.frequency === 'immediate'
									? 'default'
									: 'outline'
							}
							size="sm"
							onClick={() => handleFrequencyChange('immediate')}
							className="justify-start"
						>
							Immediate
						</Button>
						<Button
							variant={
								settings.frequency === 'hourly'
									? 'default'
									: 'outline'
							}
							size="sm"
							onClick={() => handleFrequencyChange('hourly')}
							className="justify-start"
						>
							Hourly Digest
						</Button>
						<Button
							variant={
								settings.frequency === 'daily'
									? 'default'
									: 'outline'
							}
							size="sm"
							onClick={() => handleFrequencyChange('daily')}
							className="justify-start"
						>
							Daily Digest
						</Button>
					</div>
				</div>

				<div className="flex justify-end">
					<Button
						onClick={saveSettings}
						disabled={isSaving}
						className="gap-2"
					>
						{isSaving ? (
							<>Saving...</>
						) : (
							<>
								<Save className="h-4 w-4" />
								Save Settings
							</>
						)}
					</Button>
				</div>
			</div>
		</Tabs>
	)
}
