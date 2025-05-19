import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/shared/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			// Your theme extensions here
			keyframes: {
				shimmer: {
					'100%': {
						transform: 'translateX(100%)',
					},
				},
				flicker: {
					'0%': { 'background-position': '200% 0' },
					'100%': { 'background-position': '-200% 0' },
				},
			},
			animation: {
				shimmer: 'shimmer 2s infinite',
				'flicker': 'flicker 3s linear infinite',
				'flicker-fast': 'flicker 1.5s linear infinite',
			},
		},
	},
	plugins: [],
};

export default config;
