type ThemeColors = {
	background: string
	foreground: string
	card: string
	cardForeground: string
	popover: string
	popoverForeground: string
	primary: string
	primaryForeground: string
	secondary: string
	secondaryForeground: string
	muted: string
	mutedForeground: string
	accent: string
	accentForeground: string
	border: string
	input: string
	ring: string
}

type Theme = {
	colors: ThemeColors
}

export const SUPABASE_GREEN = '#3ECF8E'

export const darkTheme: Theme = {
	colors: {
		background: 'hsl(240 10% 3.9%)',
		foreground: 'hsl(0 0% 98%)',
		card: 'hsl(240 10% 3.9%)',
		cardForeground: 'hsl(0 0% 98%)',
		popover: 'hsl(240 10% 3.9%)',
		popoverForeground: 'hsl(0 0% 98%)',
		primary: SUPABASE_GREEN,
		primaryForeground: 'hsl(240 5.9% 10%)',
		secondary: 'hsl(240 3.7% 15.9%)',
		secondaryForeground: 'hsl(0 0% 98%)',
		muted: 'hsl(240 3.7% 15.9%)',
		mutedForeground: 'hsl(240 5% 64.9%)',
		accent: SUPABASE_GREEN,
		accentForeground: 'hsl(0 0% 98%)',
		border: 'hsl(240 3.7% 15.9%)',
		input: 'hsl(240 3.7% 15.9%)',
		ring: SUPABASE_GREEN
	}
}

export const createCustomTheme = (accentColor: string): Theme => ({
	...darkTheme,
	colors: {
		...darkTheme.colors,
		primary: accentColor,
		accent: accentColor,
		ring: accentColor
	}
})
