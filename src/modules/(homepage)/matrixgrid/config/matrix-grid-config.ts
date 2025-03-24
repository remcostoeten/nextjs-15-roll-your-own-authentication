export const MATRIX_GRID_CONFIG = {
	MATRIX_RAIN: {
		ENABLED: true,
		SPEED: 60, // Slower speed for more subtle animation
		COLOR: 'rgba(0, 255, 0, 0.35)', // Increased opacity from 0.25 to 0.35
		FONT_SIZE: 10, // Smaller font size for less visual noise
		CHARACTERS: '01', // Binary characters for cleaner look
	},
	SPOTLIGHT: {
		ENABLED: true,
		COLOR: 'rgba(15, 255, 15, 0.1)', // Increased opacity from 0.05 to 0.1
		STRENGTH: 0.9, // Increased from 0.7 to 0.9
		RADIUS: 70, // Increased from 60 to 70 for a wider effect
	},
	ANIMATIONS: {
		CARD_HOVER: true,
		STAGGERED_ENTRANCE: true,
	},
	ACCESSIBILITY: {
		HIGH_CONTRAST_MODE: false,
		REDUCED_MOTION: false,
	},
}

export type MatrixGridConfig = typeof MATRIX_GRID_CONFIG
