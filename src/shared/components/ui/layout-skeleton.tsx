import { cn } from '@/shared/utilities/cn';
import { Skeleton } from './skeleton';

interface LayoutSkeletonProps {
	className?: string;
	/**
	 * Whether to show the sidebar in collapsed state
	 */
	sidebarCollapsed?: boolean;
}

export function LayoutSkeleton({ className, sidebarCollapsed = false }: LayoutSkeletonProps) {
	return (
		<div className={cn('flex min-h-screen', className)}>
			{/* Sidebar Skeleton */}
			<div
				className={cn(
					'flex flex-col border-r border-border bg-card transition-all duration-300',
					sidebarCollapsed ? 'w-[60px]' : 'w-[240px]'
				)}
			>
				{/* Logo area */}
				<div className="flex h-[60px] items-center border-b border-border px-4">
					<Skeleton className="h-8 w-full" />
				</div>

				{/* Navigation items */}
				<div className="flex flex-col gap-2 p-4">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="flex items-center gap-3">
							<Skeleton variant="circular" className="h-8 w-8" />
							{!sidebarCollapsed && <Skeleton variant="text" className="flex-1" />}
						</div>
					))}
				</div>

				{/* Bottom section */}
				<div className="mt-auto border-t border-border p-4">
					<div className="flex items-center gap-3">
						<Skeleton variant="circular" className="h-8 w-8" />
						{!sidebarCollapsed && (
							<div className="flex flex-1 flex-col gap-1">
								<Skeleton variant="text" className="w-2/3" />
								<Skeleton variant="text" className="w-1/2" />
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Main Content Area */}
			<div className="flex flex-1 flex-col">
				{/* Top Navigation Bar */}
				<div className="flex h-[60px] items-center justify-between border-b border-border bg-card px-4">
					{/* Breadcrumb */}
					<div className="flex items-center gap-2">
						<Skeleton variant="text" className="w-20" />
						<div className="text-muted-foreground">/</div>
						<Skeleton variant="text" className="w-24" />
						<div className="text-muted-foreground">/</div>
						<Skeleton variant="text" className="w-32" />
					</div>

					{/* Right side actions */}
					<div className="flex items-center gap-4">
						<Skeleton variant="circular" className="h-8 w-8" />
						<Skeleton variant="circular" className="h-8 w-8" />
						<Skeleton variant="circular" className="h-9 w-9" />
					</div>
				</div>

				{/* Page Content */}
				<div className="flex-1 p-6">
					{/* Page header */}
					<div className="mb-8">
						<Skeleton variant="text" className="mb-2 h-8 w-1/3" />
						<Skeleton variant="text" className="h-4 w-1/2" />
					</div>

					{/* Content grid */}
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{Array.from({ length: 6 }).map((_, i) => (
							<div key={i} className="rounded-lg border border-border bg-card p-4">
								<Skeleton className="mb-4 h-32 w-full rounded-md" />
								<Skeleton variant="text" className="mb-2 w-2/3" />
								<Skeleton variant="text" className="w-1/2" />
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
