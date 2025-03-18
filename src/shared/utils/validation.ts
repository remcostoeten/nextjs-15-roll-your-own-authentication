import { WIDGET_CONSTANTS } from '../constants/widget-constants';
import type { Position } from '../types/widget-types';

export function validatePosition(position: Position): Position {
    return {
        x: typeof position.x === "number" && !isNaN(position.x)
            ? position.x
            : WIDGET_CONSTANTS.DEFAULT_POSITION.x,
        y: typeof position.y === "number" && !isNaN(position.y)
            ? position.y
            : WIDGET_CONSTANTS.DEFAULT_POSITION.y,
    }
}

export function validateOpacity(opacity: number): number {
    return Math.max(WIDGET_CONSTANTS.MIN_OPACITY, Math.min(WIDGET_CONSTANTS.MAX_OPACITY, opacity))
}

export function validateTheme(theme: string): 'light' | 'dark' {
    return theme === 'light' || theme === 'dark' ? theme : WIDGET_CONSTANTS.DEFAULT_THEME
} 