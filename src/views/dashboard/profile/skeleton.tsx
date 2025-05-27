import { ConnectedAccountsSkeleton } from '@/modules/authenticatie/ui/connected-accounts-skeleton';
import { ProfileFormSkeleton } from '@/modules/authenticatie/ui/profile-form-skeleton';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Separator } from 'ui';

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
