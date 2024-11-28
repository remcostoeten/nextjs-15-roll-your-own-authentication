import Center from '@/shared/atoms/Center'

type SpinnerProps = {
	size?: 'sm' | 'md' | 'lg'
	className?: string
	speed?: 'slow' | 'normal' | 'fast'
	color?: 'primary' | 'secondary' | 'white'
	center?: boolean
}

export default function Spinner({
	size = 'md',
	className,
	speed = 'normal',
	color = 'primary',
	center = true
}: SpinnerProps) {
	const sizes = {
		sm: 'h-4 w-4',
		md: 'h-8 w-8',
		lg: 'h-12 w-12'
	}

	const speeds = {
		slow: 'animate-spin-slow',
		normal: 'animate-spin',
		fast: 'animate-spin-fast'
	}

	const colors = {
		primary: 'text-primary',
		secondary: 'text-secondary',
		white: 'text-white'
	}

	const SpinnerContent = (
		<div role="status" className={className}>
			<svg
				className={`${sizes[size]} ${speeds[speed]} ${colors[color]}`}
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle
					className="opacity-25"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					strokeWidth="4"
				/>
				<path
					className="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				/>
			</svg>
			<span className="sr-only">Loading...</span>
		</div>
	)

	if (center) {
		return <Center method="grid">{SpinnerContent}</Center>
	}

	return SpinnerContent
}
