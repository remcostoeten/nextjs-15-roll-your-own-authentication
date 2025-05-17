import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

// Optimize main font loading
export const inter = Inter({
	variable: '--font-inter',
	subsets: ['latin'],
	display: 'optional', // Use optional to prevent layout shift
	preload: true,
	fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial'],
	adjustFontFallback: true,
	weight: ['400', '500', '700'],
});

// Load monospace font locally for better performance
export const jetbrainsMono = localFont({
	variable: '--font-jetbrains',
	display: 'swap',
	preload: false, // Only load when needed
	fallback: ['Consolas', 'Monaco', 'monospace'],
	src: [
		{
			path: '../../../public/fonts/JetBrainsMono-Regular.woff2',
			weight: '400',
			style: 'normal',
		},
		{
			path: '../../../public/fonts/JetBrainsMono-Bold.woff2',
			weight: '700',
			style: 'normal',
		},
	],
});
