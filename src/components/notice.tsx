'use client'

import { useDismissedState } from '../hooks/use-local-storage'
import NotificationBar from './notification-bar/notification-bar'

export default function Notice() {
	const [isDismissed] = useDismissedState('feature-notification')

	if (isDismissed) return null

	const notices = [
		{
			badgeText: 'WIP',
			badgeEmoji: 'rocket' as const,
			message:
				'🚧 This project is under active development. New features coming soon!'
		}
	]

	return (
		<NotificationBar
			notices={notices}
			animated={true}
			storageKey="feature-notification"
			position="bottom"
		/>
	)
}
