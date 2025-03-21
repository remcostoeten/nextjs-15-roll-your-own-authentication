import { WIDGET_POSITIONS, WIDGET_SIZES } from '../constants/widget.const'

export type Position = {
	x: number
	y: number
}

export type WidgetPosition = keyof typeof WIDGET_POSITIONS
export type WidgetSize = keyof typeof WIDGET_SIZES
export type Theme = 'light' | 'dark'

export interface DevToolsState {
	position: Position
	setPosition: (position: Position) => void
	opacity: number
	setOpacity: (opacity: number) => void
	widgetPosition: WidgetPosition
	setWidgetPosition: (position: WidgetPosition) => void
	isPinned: boolean
	setIsPinned: (isPinned: boolean) => void
	widgetSize: WidgetSize
	setWidgetSize: (size: WidgetSize) => void
	theme: Theme
	setTheme: (theme: Theme) => void
}
