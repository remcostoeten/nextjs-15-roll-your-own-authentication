const MATRIX_GREEN = '#0f0'

export const MATRIX_GRID_CONFIG = {
	MATRIX_RAIN: {
		ENABLED: true,
		SPEED: 33, // milliseconds between frames
		COLOR: 'rgba(0, 255, 0, 0.5)', // Made the green color semi-transparent
		FONT_SIZE: 15,
		CHARACTERS: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%',
	},
	SPOTLIGHT: {
		ENABLED: true,
		COLOR: 'rgba(15, 255, 15, 0.1)', // Reduced opacity from 0.15 to 0.1
		STRENGTH: 1,
		RADIUS: 35,
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
