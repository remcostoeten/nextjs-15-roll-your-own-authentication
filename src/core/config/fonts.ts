import { Geist, Geist_Mono } from 'next/font/google';

export const inter = Geist({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-geist',
});

export const geistMono = Geist_Mono({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-geist-mono',
});
