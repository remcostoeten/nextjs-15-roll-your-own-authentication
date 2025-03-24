/**
 * @description A store for developer tool widgets to persist their position, opacity, pinned state, size, and theme
 * @author Remco Stoeten
 */

'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { WIDGET_CONSTANTS } from '@/shared/constants/widget.const'
import type { DevToolsState, Position } from '@/shared/types/widget-types'

function validatePosition(position: Position): Position {
	return {
		x: typeof position.x === 'number' && !isNaN(position.x) ? position.x : WIDGET_CONSTANTS.DEFAULT_POSITION.x,
		y: typeof position.y === 'number' && !isNaN(position.y) ? position.y : WIDGET_CONSTANTS.DEFAULT_POSITION.y,
	}
}

function validateOpacity(opacity: number): number {
	return Math.max(WIDGET_CONSTANTS.MIN_OPACITY, Math.min(WIDGET_CONSTANTS.MAX_OPACITY, opacity))
}

export function createDevToolsStore() {
	return create<DevToolsState>()(
		persist(
			(set) => ({
				position: WIDGET_CONSTANTS.DEFAULT_POSITION,
				setPosition: (position) =>
					set({
						position: validatePosition(position),
					}),
				opacity: WIDGET_CONSTANTS.DEFAULT_OPACITY,
				setOpacity: (opacity) =>
					set({
						opacity: validateOpacity(opacity),
					}),

				widgetPosition: WIDGET_CONSTANTS.WIDGET_POSITIONS.CUSTOM,

				setWidgetPosition: (widgetPosition) =>
					set({
						widgetPosition,
					}),
				isPinned: false,
				setIsPinned: (isPinned) =>
					set({
						isPinned,
					}),
				widgetSize: WIDGET_CONSTANTS.WIDGET_SIZES.NORMAL,
				setWidgetSize: (widgetSize) =>
					set({
						widgetSize,
					}),
				theme: WIDGET_CONSTANTS.DEFAULT_THEME,
				setTheme: (theme) =>
					set({
						theme,
					}),
			}),
			{
				name: WIDGET_CONSTANTS.STORAGE_KEY,
				onRehydrateStorage: () => (state) => {
					if (state) {
						state.position = validatePosition(state.position)
						state.opacity = validateOpacity(state.opacity)
					}
				},
			}
		)
	)
}
