import { Separator } from 'ui';
import { ConnectedAccountsSkeleton, ProfileFormSkeleton, Skeleton } from 'ui';

export function ProfileViewSkeleton() {
	return (
		<div className="container mx-auto py-10">
			<div className="space-y-6">
				{/* Page title */}
				<div>
					<Skeleton className="h-8 w-20 mb-2" />
					<Skeleton className="h-4 w-80" />
				</div>

				<Separator />

				{/* Profile Form Skeleton */}
				<ProfileFormSkeleton />

				{/* Connected Accounts Skeleton */}
				<ConnectedAccountsSkeleton />
			</div>
		</div>
	);
}
