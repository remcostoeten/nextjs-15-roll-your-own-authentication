import {
	JetBrains_Mono,
	IBM_Plex_Mono,
	Inter,
	Geist_Mono
} from 'next/font/google'

const geistMono = Geist_Mono({
	subsets: ['latin'],
	variable: '--font-geist-mono'
})

const jetbrainsMono = JetBrains_Mono({
	subsets: ['latin'],
	variable: '--font-jetbrains-mono'
})

const ibmPlexMono = IBM_Plex_Mono({
	weight: ['400', '500', '600', '700'],
	subsets: ['latin'],
	variable: '--font-ibm-plex-mono'
})

const interMono = Inter({
	subsets: ['latin'],
	variable: '--font-inter'
})

export const fonts = {
	geistMono,
	jetbrainsMono,
	ibmPlexMono,
	interMono
}

export const fontVariables = `
  ${fonts.geistMono.variable} 
  ${fonts.jetbrainsMono.variable} 
  ${fonts.ibmPlexMono.variable} 
  ${fonts.interMono.variable}
`

export const fontOptions = [
	{
		name: 'Geist Mono',
		className: 'font-geist-mono',
		fontObject: fonts.geistMono
	},
	{
		name: 'JetBrains Mono',
		className: 'font-jetbrains-mono',
		fontObject: fonts.jetbrainsMono
	},
	{
		name: 'IBM Plex Mono',
		className: 'font-ibm-plex-mono',
		fontObject: fonts.ibmPlexMono
	},
	{
		name: 'Inter Mono',
		className: 'font-inter-mono',
		fontObject: fonts.interMono
	}
]

export function getFontByClassName(className: string) {
	return fontOptions.find((font) => font.className === className)
}
