import { useScroll, useSpring, useTransform } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { ANIMATION_CONFIGS } from './animations'
import { NAVBAR_CONSTANTS, THEME_COLORS } from './constants'

export const getThemeColors = (theme: string) => {
	return theme === 'dark' ? THEME_COLORS.DARK : THEME_COLORS.LIGHT
}

export const getScrollProgress = (scrollY: number): number => {
	return Math.min(
		Math.max(scrollY / NAVBAR_CONSTANTS.PIXELS_TO_SWITCH_NAVMODE, 0),
		1
	)
}

export const getContainerStyles = (progress: number) => {
	const padding = NAVBAR_CONSTANTS.CONTAINER_PADDING
	const currentPadding =
		padding.INITIAL + (padding.SCROLLED - padding.INITIAL) * progress

	return {
		padding: `${currentPadding}px`,
		maxWidth:
			progress === 1 ? '100%' : `${NAVBAR_CONSTANTS.MIN_SCREEN_WIDTH}px`,
		borderRadius: `${NAVBAR_CONSTANTS.BORDER_RADIUS.INITIAL * (1 - progress)}px`
	}
}

export const useScrollTransform = () => {
	const { scrollY } = useScroll()

	const scrollProgress = useTransform(
		scrollY,
		[0, NAVBAR_CONSTANTS.PIXELS_TO_SWITCH_NAVMODE],
		[0, 1]
	)

	const smoothProgress = useSpring(
		scrollProgress,
		ANIMATION_CONFIGS.SPRING_BOUNCE
	)

	return {
		containerWidth: useTransform(smoothProgress, [0, 1], ['90%', '100%']),
		containerPadding: useTransform(smoothProgress, [0, 1], ['20px', '0px']),
		maxWidth: useTransform(smoothProgress, [0, 1], ['1200px', '100%']),
		borderRadius: useTransform(smoothProgress, [0, 1], ['46px', '0px']),
		yOffset: useTransform(smoothProgress, [0, 1], ['10px', '0px'])
	}
}

export const useThemeTransition = () => {
	const { theme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	const toggleTheme = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark')
	}

	return {
		theme,
		toggleTheme,
		mounted,
		isDark: theme === 'dark'
	}
}
