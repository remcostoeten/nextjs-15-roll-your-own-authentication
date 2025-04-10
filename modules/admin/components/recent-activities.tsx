import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

export function RecentActivities() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Recent Activities</CardTitle>
				<CardDescription>
					Recent user activities across the platform
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="flex items-center gap-4 rounded-lg border p-4">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="h-5 w-5 text-primary"
							>
								<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
								<circle
									cx="9"
									cy="7"
									r="4"
								/>
								<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
								<path d="M16 3.13a4 4 0 0 1 0 7.75" />
							</svg>
						</div>
						<div className="flex-1">
							<p className="text-sm font-medium">
								New user registered
							</p>
							<p className="text-sm text-muted-foreground">
								A few minutes ago
							</p>
						</div>
					</div>
					<p className="text-sm text-muted-foreground text-center py-4">
						Activity tracking is currently disabled
					</p>
				</div>
			</CardContent>
		</Card>
	)
}
