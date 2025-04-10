'use client'

import { Toast as CoreToast } from '@/src/shared/components/core-components/toast'
import type {
	ToastVariant as CoreToastVariant,
	ToastPosition,
} from '@/src/shared/components/core-components/toast'

export type ToastVariant = CoreToastVariant
export type ToastPositionType = ToastPosition

interface ToastProps {
	variant: ToastVariant
	message?: string
	onAction?: () => void
	onSecondaryAction?: () => void
	actionLabel?: string
	secondaryActionLabel?: string
	isLoading?: boolean
	position?: ToastPositionType
	duration?: number
	onClose?: () => void
}

export function Toast({
	variant,
	message,
	onAction,
	onSecondaryAction,
	actionLabel,
	secondaryActionLabel,
	isLoading = false,
	position = 'bottom',
	duration,
	onClose,
}: ToastProps) {
	return (
		<CoreToast
			variant={variant}
			message={message}
			onAction={onAction}
			onSecondaryAction={onSecondaryAction}
			actionLabel={actionLabel}
			secondaryActionLabel={secondaryActionLabel}
			isLoading={isLoading}
			position={position}
			duration={duration}
			onClose={onClose}
		/>
	)
}
