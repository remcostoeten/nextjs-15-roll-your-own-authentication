import type React from 'react'
import { cn } from 'helpers'

function Skeleton({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn('skeleton-shimmer rounded-md', className)}
			{...props}
		/>
	)
}

export { Skeleton }
