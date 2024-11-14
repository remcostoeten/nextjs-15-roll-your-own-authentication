'use client'

type SessionIndicatorProps = {
	isActive?: boolean
}

export default function SessionIndicator({
	isActive = false
}: SessionIndicatorProps) {
	return (
		<div className="flex items-center gap-2">
			<div
				className={`h-2 w-2 rounded-full ${
					isActive ? 'bg-green-500' : 'bg-gray-300'
				}`}
			/>
			<span>{isActive ? 'Active' : 'Inactive'}</span>
		</div>
	)
}
