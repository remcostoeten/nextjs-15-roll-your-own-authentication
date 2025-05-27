import { Skeleton } from '@/shared/components/ui/skeleton';

export default function DashboardLoading() {
	return (
		<div className="container mx-auto py-10">
			<div className="space-y-8">
				{/* Welcome section skeleton */}
				<div className="space-y-2">
					<Skeleton className="h-8 w-48" />
					<Skeleton className="h-4 w-96" />
				</div>

				{/* Stats section skeleton */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{[...Array(4)].map((_, i) => (
						<div key={`stat-${i}`} className="rounded-lg border p-6">
							<Skeleton className="h-4 w-20 mb-2" />
							<Skeleton className="h-8 w-16" />
						</div>
					))}
				</div>

				{/* Recent activity skeleton */}
				<div className="rounded-lg border p-6">
					<Skeleton className="h-6 w-32 mb-4" />
					<div className="space-y-3">
						{[...Array(5)].map((_, i) => (
							<div key={`activity-${i}`} className="flex items-center space-x-3">
								<Skeleton className="h-10 w-10 rounded-full" />
								<div className="flex-1">
									<Skeleton className="h-4 w-3/4 mb-2" />
									<Skeleton className="h-3 w-1/2" />
								</div>
								<Skeleton className="h-8 w-20" />
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
