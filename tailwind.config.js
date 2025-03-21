/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ['class'],
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/views/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/shared/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/modules/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				offwhite: 'var(--offwhite)',
				'title-light': 'var(--title-light)',
				offblack: 'var(--offblack)',
				bg: 'var(--bg)',
				panel: 'var(--panel)',
				button: 'var(--button)',
				'text-button': 'var(--text-button)',
				'button-border': 'var(--button-border)',
				border: 'var(--border)',
				input: 'var(--input)',
				ring: 'var(--ring)',
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				'error-pulse': {
					'0%, 100%': { borderColor: 'rgb(185, 28, 28)' },
					'50%': { borderColor: 'rgb(239, 68, 68)' },
				},
				'fade-in-up': {
					'0%': { opacity: 0, transform: 'translateY(10px)' },
					'100%': { opacity: 1, transform: 'translateY(0)' },
				},
				'fade-in': {
					'0%': { opacity: 0 },
					'100%': { opacity: 1 },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				pulse: 'error-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'fade-in-1': 'fade-in-up 0.5s ease-out forwards',
				'fade-in-2': 'fade-in-up 0.5s ease-out 0.1s forwards',
				'fade-in-3': 'fade-in-up 0.5s ease-out 0.2s forwards',
				'fade-in-4': 'fade-in-up 0.5s ease-out 0.3s forwards',
				'fade-in-5': 'fade-in-up 0.5s ease-out 0.4s forwards',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}
