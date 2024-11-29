import type { MotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

export type ToastVariant = 'info' | 'success' | 'error' | 'warning'
export type ToastPosition =
	| 'top-left'
	| 'top-right'
	| 'bottom-left'
	| 'bottom-right'
export type ToastAnimation = 'slide' | 'fade'

export type ToastProps = {
	id: string
	message: string
	description?: string
	variant?: ToastVariant
	position?: ToastPosition
	duration?: number
	animation?: ToastAnimation
	showProgress?: boolean
	showSpinner?: boolean
	isPending?: boolean
	onRemove?: (id: string) => void
}

export type ToastMotionProps = MotionProps & {
	children: ReactNode
}
