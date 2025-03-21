import { WidgetPosition, WIDGET_CONSTANTS } from '@/shared/constants/widget.const'
import type {
	DevToolsState,
	Position,
	WidgetSize,
	Theme,
} from '@/shared/types/widget-types'
import { set } from 'zod'


 function validatePosition(position: Position): Position {
	return {
		x: Math.max(0, Math.min(position.x, window.innerWidth - 100)),
		y: Math.max(0, Math.min(position.y, window.innerHeight - 100))
	}
}
	
 function validateTheme(theme: Theme): Theme {
	return theme === 'light' || theme === 'dark' ? theme : WIDGET_CONSTANTS.DEFAULT_THEME as Theme
}


function validateOpacity(opacity: number): number {
	return Math.max(WIDGET_CONSTANTS.MIN_OPACITY, Math.min(opacity, WIDGET_CONSTANTS.MAX_OPACITY))
}

export function	 createDevToolsActions(
	set: (fn: (state: DevToolsState) => Partial<DevToolsState>) => void
) {
	return {
		setPosition: (position: Position) =>
		set(() => ({
			position: validatePosition(position),
			widgetPosition: WidgetPosition.CUSTOM,
		})),

	setOpacity: (opacity: number) =>
		set(() => ({
			opacity: validateOpacity(opacity),
		})),

	setWidgetPosition: (widgetPosition: WidgetPosition) =>
		set(() => ({
			widgetPosition,
		})),

	setIsPinned: (isPinned: boolean) =>
		set(() => ({
			isPinned,
		})),

	setWidgetSize: (widgetSize: WidgetSize) =>
		set(() => ({
			widgetSize,
		})),

	setTheme: (theme: Theme) =>
		set(() => ({
			theme: validateTheme(theme),
		})),
	}
}
