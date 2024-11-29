export const TOAST_LIMIT = 5
export const DEFAULT_DURATION = 5000

export const POSITION_STYLES = {
	'top-right': 'top-4 right-4',
	'top-left': 'top-4 left-4',
	'bottom-right': 'bottom-4 right-4',
	'bottom-left': 'bottom-4 left-4',
	'top-center': 'top-4 left-1/2 -translate-x-1/2',
	'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
} as const

export const ANIMATIONS = {
	initial: {
		opacity: 0,
		y: 50,
		scale: 0.9
	},
	animate: {
		opacity: 1,
		y: 0,
		scale: 1
	},
	exit: {
		opacity: 0,
		scale: 0.9,
		transition: { duration: 0.2 }
	}
} as const
