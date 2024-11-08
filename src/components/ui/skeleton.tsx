type SkeletonProps = React.HTMLAttributes<HTMLDivElement>

export function Skeleton({
	className = '',
	...props
}: SkeletonProps): JSX.Element {
	return (
		<div
			className={`animate-pulse rounded-md bg-white/10 ${className}`}
			{...props}
		/>
	)
}
