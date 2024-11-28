import { HTMLMotionProps } from 'framer-motion'

declare module 'framer-motion' {
	export interface MotionProps extends HTMLMotionProps<'div'> {
		className?: string
	}

	export interface AnimatePresenceProps {
		children: React.ReactNode
		mode?: 'sync' | 'wait' | 'popLayout'
		initial?: boolean
		onExitComplete?: () => void
		exitBeforeEnter?: boolean
		presenceAffectsLayout?: boolean
	}
}
