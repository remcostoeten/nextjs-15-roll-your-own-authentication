import { cn } from '@/shared/_docs/code-block/cn'

function Skeleton({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn('animate-pulse rounded-md bg-gray-700/20', className)}
			{...props}
		/>
	)
}

export { Skeleton }
