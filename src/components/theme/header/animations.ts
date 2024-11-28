export const HeaderAnimations = {
	container: {
		initial: {
			backgroundColor: 'rgba(0, 0, 0, 0)',
			backdropFilter: 'blur(0px)'
		},
		scrolled: {
			backgroundColor: 'rgba(0, 0, 0, 0.7)',
			backdropFilter: 'blur(12px)'
		}
	},
	nav: {
		initial: {
			y: 0,
			opacity: 1,
			scale: 1,
			borderRadius: '16px'
		},
		scrolled: {
			y: 0,
			opacity: 1,
			scale: 1,
			borderRadius: '0px'
		},
		hidden: {
			opacity: 0,
			scale: 0.95,
			duration: 1.3,
			ease: [0.22, 1, 0.36, 1]
		}
	},
	transition: {
		duration: 1.3,
		ease: [0.22, 1, 0.36, 1]
	}
}

export const scrollConfig = {
	threshold: 20,
	hideThreshold: 60,
	debounceDelay: 10
}
