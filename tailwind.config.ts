import type { Config } from 'tailwindcss'

const config = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
		'*.{js,ts,jsx,tsx,mdx}',
	],
	prefix: '',
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
				border: 'var(--border)',
				input: 'var(--input)',
				ring: 'var(--ring)',
				background: 'var(--popover)',
				foreground: 'var(--foreground)',
				primary: {
					DEFAULT: 'var(--primary)',
					foreground: 'var(--primary-foreground)',
				},
				secondary: {
					DEFAULT: 'var(--secondary)',
					foreground: 'var(--secondary-foreground)',
				},
				destructive: {
					DEFAULT: 'var(--destructive)',
					foreground: 'var(--destructive-foreground)',
				},
				muted: {
					DEFAULT: 'var(--muted)',
					foreground: 'var(--muted-foreground)',
				},
				accent: {
					DEFAULT: 'var(--accent)',
					foreground: 'var(--accent-foreground)',
				},
				popover: {
					DEFAULT: 'var(--popover)',
					foreground: 'var(--popover-foreground)',
				},
				card: {
					DEFAULT: 'var(--card)',
					foreground: 'var(--card-foreground)',
				},
				// Add Supabase specific colors
				bg: 'var(--bg)',
				'active-bg': 'var(--active-bg)',
				'btn-50opacity': 'var(--btn-50opacity)',
				white: 'rgb(250, 250, 250)',
				'menu-hover': 'var(--menu-hover)',
				title: 'var(--title)',
				'title-light': 'var(--title-light)',
				text: 'var(--text)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
			transitionTimingFunction: {
				'bezier-1': 'cubic-bezier(0.25, 0.1, 0.25, 1)', // standard ease
				'bezier-2': 'cubic-bezier(0.42, 0, 0.58, 1)', // ease-in-out
				'bezier-3': 'cubic-bezier(0.68, -0.55, 0.27, 1.55)', // elastic-ish
				'bezier-4': 'cubic-bezier(0.87, 0, 0.13, 1)', // sharp ease-in-out
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
} satisfies Config

export default config
