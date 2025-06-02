import { Skeleton } from '@/shared/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from 'ui';

/**
 * Renders a skeleton placeholder for a profile form during loading states.
 *
 * Displays skeleton elements representing the structure of a profile form, including fields for name, email, current password, new password, and action buttons.
 */
export function ProfileFormSkeleton() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<Skeleton className="h-6 w-20" />
				</CardTitle>
				<CardDescription>
					<Skeleton className="h-4 w-64" />
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{/* Name field */}
					<div className="space-y-2">
						<Skeleton className="h-4 w-12" />
						<Skeleton className="h-10 w-full" />
					</div>

					{/* Email field */}
					<div className="space-y-2">
						<Skeleton className="h-4 w-12" />
						<Skeleton className="h-10 w-full" />
					</div>

					{/* Current Password field */}
					<div className="space-y-2">
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-10 w-full" />
					</div>

					{/* New Password field */}
					<div className="space-y-2">
						<Skeleton className="h-4 w-28" />
						<Skeleton className="h-10 w-full" />
					</div>

					{/* Submit button */}
					<Skeleton className="h-10 w-32" />
				</div>
			</CardContent>
			<CardFooter className="flex flex-col items-start gap-4">
				{/* Link */}
				<Skeleton className="h-4 w-48" />

				{/* Delete button */}
				<Skeleton className="h-10 w-32" />
			</CardFooter>
		</Card>
	);
}
