export const NAVBAR_CONSTANTS = {
	COLORS: {
		BG: {
			DEFAULT: 'rgba(18, 18, 18, 0.95)',
			BOXED: 'rgba(18, 18, 18, 0.8)'
		},
		BORDER: 'rgba(255, 255, 255, 0.1)',
		TEXT: {
			PRIMARY: 'rgba(255, 255, 255, 0.9)',
			SECONDARY: 'rgba(255, 255, 255, 0.6)'
		}
	},
	SIZING: {
		HEIGHT: '60px',
		BOXED_WIDTH: '90%',
		MAX_WIDTH: '1400px',
		BORDER_RADIUS: '46px'
	}
} as const
export const containerVariants = {
	initial: {
		width: '90%',
		y: 10
	},
	scrolled: {
		width: '100vw',
		y: 0
	}
}

export const navVariants = {
	initial: {
		borderRadius: '46px',
		margin: '0 auto',
		backgroundColor: 'rgba(18, 18, 18, 0.8)',
		borderWidth: '1px',
		maxWidth: '1400px'
	},
	scrolled: {
		borderRadius: '0px',
		margin: '0',
		backgroundColor: 'rgba(18, 18, 18, 0.95)',
		borderWidth: '0 0 1px 0',
		maxWidth: '100vw'
	}
}

export const THEME_COLORS = {
	LIGHT: {
		BG_PRIMARY: 'rgba(255, 255, 255, 0.95)',
		BG_SECONDARY: 'rgba(255, 255, 255, 0.5)',
		TEXT_PRIMARY: 'rgb(15, 23, 42)',
		TEXT_SECONDARY: 'rgb(71, 85, 105)',
		BORDER: 'rgba(15, 23, 42, 0.1)',
		HOVER: 'rgba(0, 0, 0, 0.05)',
		GRADIENT: {
			FROM: 'rgb(99, 102, 241)',
			TO: 'rgb(168, 85, 247)'
		}
	},
	DARK: {
		BG_PRIMARY: 'rgba(0, 0, 0, 0.95)',
		BG_SECONDARY: 'rgba(0, 0, 0, 0.5)',
		TEXT_PRIMARY: 'rgb(255, 255, 255)',
		TEXT_SECONDARY: 'rgba(255, 255, 255, 0.6)',
		BORDER: 'rgba(255, 255, 255, 0.1)',
		HOVER: 'rgba(255, 255, 255, 0.05)',
		GRADIENT: {
			FROM: 'rgb(129, 140, 248)',
			TO: 'rgb(168, 85, 247)'
		}
	}
} as const
