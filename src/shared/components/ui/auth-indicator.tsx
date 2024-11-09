'use client'

import Tooltip from '@/components/tooltip'
import { useUser } from '@/features/auth/hooks/use-user'
import { cn } from '@/lib/utils'

export default function AuthIndicator() {
	const { user, loading } = useUser()

	const buttonClasses = cn(
		'fixed bottom-4 left-4 w-3 h-3 rounded-full transition-all duration-300',
		'animate-pulse shadow-lg hover:scale-110',
		{
			'bg-green-500': user !== null,
			'bg-yellow-500': loading,
			'bg-red-500': !loading && !user
		}
	)

	const tooltipContent = user
		? `Logged in as ${user.email}${user.role ? `\nRole: ${user.role}` : ''}`
		: 'Not authenticated'

	return (
		<Tooltip
			content={tooltipContent}
			position="top"
			variant="dark"
			animation="scale"
			delayShow={200}
			borderVariant="light"
			showPointer={true}
			pointerStyle="arrow"
			icon={user ? 'success' : 'info'}
		>
			<button
				className={buttonClasses}
				aria-label="Authentication status indicator"
			/>
		</Tooltip>
	)
}
