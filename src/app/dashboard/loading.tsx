'use client';

import { Card } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

export default function DashboardLoading() {
	return (
		<div className="flex min-h-screen w-full flex-col space-y-6 p-4 md:p-8">
			{/* Header Skeleton */}
			<div className="flex items-center justify-between">
				<div className="space-y-2">
					<Skeleton className="h-8 w-[200px]" />
					<Skeleton className="h-4 w-[300px]" />
				</div>
				<Skeleton className="h-10 w-10 rounded-full" />
			</div>

			{/* Main Content Grid */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{/* Stats Cards */}
				{Array.from({ length: 3 }).map((_, i) => (
					<Card key={i} className="p-6">
						<div className="space-y-4">
							<Skeleton className="h-4 w-[120px]" />
							<div className="flex items-center justify-between">
								<Skeleton className="h-8 w-[100px]" />
								<Skeleton className="h-8 w-8 rounded-full" />
							</div>
							<Skeleton className="h-2 w-full" />
							<Skeleton className="h-2 w-4/5" />
						</div>
					</Card>
				))}
			</div>

			{/* Activity Section */}
			<Card className="p-6">
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<Skeleton className="h-6 w-[150px]" />
						<Skeleton className="h-8 w-[100px]" />
					</div>

					{/* Activity List */}
					<div className="space-y-4">
						{Array.from({ length: 5 }).map((_, i) => (
							<div key={i} className="flex items-center space-x-4">
								<Skeleton className="h-12 w-12 rounded-full" />
								<div className="space-y-2 flex-1">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-3 w-4/5" />
								</div>
								<Skeleton className="h-4 w-[60px]" />
							</div>
						))}
					</div>
				</div>
			</Card>

			{/* Chart Section */}
			<Card className="p-6">
				<div className="space-y-6">
					<Skeleton className="h-6 w-[150px]" />
					<div className="space-y-2">
						<Skeleton className="h-[200px] w-full rounded-lg" />
						<div className="flex justify-between">
							{Array.from({ length: 7 }).map((_, i) => (
								<Skeleton key={i} className="h-4 w-12" />
							))}
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
}
