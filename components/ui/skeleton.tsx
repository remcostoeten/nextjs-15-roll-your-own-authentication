import { cn } from '@/shared/helpers'

function Skeleton({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn('animate-pulse rounded-md bg-neutral-700', className)}
			{...props}
		/>
	)
}

export { Skeleton }
