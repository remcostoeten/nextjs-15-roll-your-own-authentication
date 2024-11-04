import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

export const inter = Inter({ subsets: ['latin'] })
export const geistSans = localFont({
	src: '../../../public/fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900'
})
export const geistMono = localFont({
	src: '../../../public/fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900'
})
