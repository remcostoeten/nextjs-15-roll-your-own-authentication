/**
 * Dark Auth Theme
 *
 * This file contains color and style constants for the dark auth theme
 * inspired by Vercel and other modern design systems.
 */

export const darkAuthTheme = {
	// Colors
	colors: {
		background: '#0a0a0a',
		cardBackground: '#111111',
		primary: '#2E71E5',
		text: '#ffffff',
		textSecondary: '#888888',
		textMuted: '#666666',
		border: '#333333',
		inputBorder: '#444444',
		error: '#ff4d4f',
		success: '#52c41a',
	},

	// Typography
	typography: {
		fontFamily:
			'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
		heading: {
			fontSize: '1.875rem', // text-3xl
			fontWeight: '700', // font-bold
			lineHeight: '2.25rem',
		},
		body: {
			fontSize: '0.875rem', // text-sm
			fontWeight: '400',
			lineHeight: '1.25rem',
		},
		small: {
			fontSize: '0.75rem', // text-xs
			fontWeight: '400',
			lineHeight: '1rem',
		},
	},

	// Spacing
	spacing: {
		sm: '0.5rem',
		md: '1rem',
		lg: '1.5rem',
		xl: '2rem',
		xxl: '3rem',
	},

	// Border radius
	borderRadius: {
		sm: '0.25rem',
		md: '0.375rem',
		lg: '0.5rem',
		xl: '0.75rem',
		full: '9999px',
	},

	// Shadows
	shadows: {
		sm: '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
		md: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.5)',
		lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.5)',
	},

	// Transitions
	transitions: {
		fast: '150ms',
		normal: '200ms',
		slow: '300ms',
	},

	// Focus styles
	focus: {
		ring: '2px',
		ringColor: 'rgba(46, 113, 229, 0.5)',
		outline: 'none',
	},

	// Input styles
	input: {
		background: '#111111',
		borderColor: '#444444',
		borderColorFocus: '#2E71E5',
		textColor: '#ffffff',
		placeholderColor: '#666666',
	},

	// Button styles
	button: {
		primary: {
			background: '#2E71E5',
			backgroundHover: 'rgba(46, 113, 229, 0.9)',
			textColor: '#ffffff',
		},
		secondary: {
			background: 'transparent',
			backgroundHover: 'rgba(255, 255, 255, 0.1)',
			textColor: '#ffffff',
			borderColor: '#444444',
		},
	},
}

export default darkAuthTheme
