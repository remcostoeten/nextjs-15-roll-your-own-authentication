'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, AlertTriangle, Info, Bell } from 'lucide-react'

interface NotificationStatsProps {
	total: number
	unread: number
	typeStats: Record<string, number>
}

export function NotificationStats({
	total,
	unread,
	typeStats,
}: NotificationStatsProps) {
	// Calculate read percentage
	const readPercentage =
		total > 0 ? Math.round(((total - unread) / total) * 100) : 100

	return (
		<>
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-medium">
						Total Notifications
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
								<Bell className="h-4 w-4 text-primary" />
							</div>
							<div className="text-2xl font-bold">{total}</div>
						</div>
						<div className="text-xs text-muted-foreground">
							{unread} unread
						</div>
					</div>
					<div className="mt-3">
						<div className="flex items-center justify-between text-xs mb-1">
							<span>Read progress</span>
							<span className="font-medium">
								{readPercentage}%
							</span>
						</div>
						<Progress
							value={readPercentage}
							className="h-1.5"
						/>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-medium">
						By Type
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 gap-2">
						<div className="flex items-center gap-2">
							<div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/50">
								<CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
							</div>
							<div className="text-sm">
								<div className="font-medium">
									{typeStats.success || 0}
								</div>
								<div className="text-xs text-muted-foreground">
									Success
								</div>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/50">
								<AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
							</div>
							<div className="text-sm">
								<div className="font-medium">
									{typeStats.warning || 0}
								</div>
								<div className="text-xs text-muted-foreground">
									Warning
								</div>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/50">
								<AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
							</div>
							<div className="text-sm">
								<div className="font-medium">
									{typeStats.error || 0}
								</div>
								<div className="text-xs text-muted-foreground">
									Error
								</div>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-50 dark:bg-sky-950/50">
								<Info className="h-3.5 w-3.5 text-sky-500" />
							</div>
							<div className="text-sm">
								<div className="font-medium">
									{typeStats.info || 0}
								</div>
								<div className="text-xs text-muted-foreground">
									Info
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-medium">
						Status
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between">
						<div className="flex flex-col gap-1">
							<div className="flex items-center gap-2">
								<div className="h-3 w-3 rounded-full bg-primary" />
								<span className="text-sm font-medium">
									Unread
								</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="h-3 w-3 rounded-full bg-muted" />
								<span className="text-sm font-medium">
									Read
								</span>
							</div>
						</div>

						<div className="relative h-16 w-16">
							<svg
								className="h-full w-full"
								viewBox="0 0 36 36"
							>
								<circle
									cx="18"
									cy="18"
									r="16"
									fill="none"
									stroke="currentColor"
									strokeWidth="4"
									className="text-muted stroke-current"
								/>
								{unread > 0 && (
									<circle
										cx="18"
										cy="18"
										r="16"
										fill="none"
										stroke="currentColor"
										strokeWidth="4"
										strokeDasharray={`${
											(unread / total) * 100
										} 100`}
										className="text-primary stroke-current"
										transform="rotate(-90 18 18)"
									/>
								)}
							</svg>
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="text-center">
									<div className="text-xl font-bold">
										{unread}
									</div>
									<div className="text-xs text-muted-foreground">
										unread
									</div>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</>
	)
}
