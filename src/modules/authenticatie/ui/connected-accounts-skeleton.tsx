import { Skeleton } from '@/shared/components/ui/skeleton';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from 'ui';

export function ConnectedAccountsSkeleton() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<Skeleton className="h-6 w-40" />
				</CardTitle>
				<CardDescription>
					<Skeleton className="h-4 w-56" />
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{/* Account items skeleton - showing 3 items */}
					{Array.from({ length: 3 }).map((_, index) => (
						<div
							key={`account-skeleton-${index}`}
							className="flex items-center justify-between rounded-lg border p-4"
						>
							<div className="flex items-center gap-4">
								{/* Provider icon */}
								<Skeleton className="h-6 w-6 rounded" />
								<div>
									{/* Provider name */}
									<Skeleton className="h-4 w-16 mb-2" />
									{/* Connection date */}
									<Skeleton className="h-3 w-32" />
								</div>
							</div>
							{/* Action button */}
							<Skeleton className="h-8 w-16" />
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
