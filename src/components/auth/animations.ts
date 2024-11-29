export const containerAnimation = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.3
		}
	}
}

export const itemAnimation = {
	hidden: { opacity: 0, y: 20 },
	visible: (index: number) => ({
		opacity: 1,
		y: 0,
		transition: {
			delay: 0.1 * index,
			duration: 0.5,
			ease: 'easeOut'
		}
	})
}

export const buttonAnimation = {
	hover: {
		scale: 1.02,
		transition: { duration: 0.2 }
	},
	tap: {
		scale: 0.98
	}
}
