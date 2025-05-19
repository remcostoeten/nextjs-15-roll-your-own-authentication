import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
	className?: string;
	/**
	 * Optional number of skeleton items to render
	 */
	count?: number;
	/**
	 * Optional variant for different skeleton styles
	 */
	variant?: 'rectangular' | 'circular' | 'text';
}

export function Skeleton({
	className,
	count = 1,
	variant = 'rectangular',
	...props
}: SkeletonProps) {
	return (
		<>
			{Array.from({ length: count }).map((_, index) => (
				<div
					key={index}
					className={cn(
						'relative overflow-hidden bg-muted/60 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
						{
							'h-4 w-full rounded': variant === 'text',
							'h-12 w-12 rounded-full': variant === 'circular',
							'h-8 w-full rounded-md': variant === 'rectangular',
						},
						className
					)}
					{...props}
				/>
			))}
		</>
	);
}
