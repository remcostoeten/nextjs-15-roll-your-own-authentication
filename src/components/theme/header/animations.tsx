export const ANIMATION_CONFIGS = {
	SPRING_BOUNCE: {
		type: 'spring',
		stiffness: 100,
		damping: 30,
		mass: 0.5
	},
	SPRING_STIFF: {
		type: 'spring',
		stiffness: 400,
		damping: 30,
		mass: 1
	},
	EASE_OUT: {
		type: 'tween',
		ease: [0.23, 1, 0.32, 1],
		duration: 0.2
	}
} as const

export const ANIMATIONS = {
	// Navbar Animations
	navbar: {
		initial: { y: -20, opacity: 0 },
		animate: {
			y: 0,
			opacity: 1,
			transition: ANIMATION_CONFIGS.SPRING_BOUNCE
		},
		exit: {
			y: -20,
			opacity: 0,
			transition: ANIMATION_CONFIGS.EASE_OUT
		}
	},

	menuItem: {
		initial: { y: -8, opacity: 0 },
		animate: (i: number) => ({
			y: 0,
			opacity: 1,
			transition: {
				...ANIMATION_CONFIGS.SPRING_BOUNCE,
				delay: 0.1 + i * 0.05
			}
		})
	},

	// Dropdown Animations
	dropdown: {
		initial: { opacity: 0, scale: 0.95, y: -10 },
		animate: {
			opacity: 1,
			scale: 1,
			y: 0,
			transition: ANIMATION_CONFIGS.SPRING_BOUNCE
		},
		exit: {
			opacity: 0,
			scale: 0.95,
			y: -10,
			transition: ANIMATION_CONFIGS.EASE_OUT
		}
	},

	searchModal: {
		overlay: {
			initial: { opacity: 0 },
			animate: { opacity: 1 },
			exit: { opacity: 0 }
		},
		content: {
			initial: { scale: 0.95, opacity: 0 },
			animate: {
				scale: 1,
				opacity: 1,
				transition: ANIMATION_CONFIGS.SPRING_BOUNCE
			},
			exit: {
				scale: 0.95,
				opacity: 0,
				transition: ANIMATION_CONFIGS.EASE_OUT
			}
		}
	},

	// Theme Toggle Animations
	themeToggle: {
		light: {
			initial: { rotate: 90, opacity: 0 },
			animate: { rotate: 0, opacity: 1 },
			exit: { rotate: -90, opacity: 0 }
		},
		dark: {
			initial: { rotate: -90, opacity: 0 },
			animate: { rotate: 0, opacity: 1 },
			exit: { rotate: 90, opacity: 0 }
		}
	}
} as const

export const navVariants = {
	initial: {
		borderRadius: '1.5rem',
		backgroundColor: 'rgba(18, 18, 18, 0.5)',
		backdropFilter: 'blur(8px)',
		margin: '0 auto'
	},
	scrolled: {
		borderRadius: '0',
		backgroundColor: 'rgba(18, 18, 18, 0.95)',
		backdropFilter: 'blur(12px)',
		margin: 0
	}
}

export const containerVariants = {
	initial: {
		width: '70%',
		y: 10,
		opacity: 1,
		left: '50%',
		x: '-50%'
	},
	scrolled: {
		width: '100%',
		y: 0,
		opacity: 1,
		left: 0,
		x: 0
	}
}
