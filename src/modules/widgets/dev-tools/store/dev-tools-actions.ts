import { WIDGET_POSITIONS } from '@/shared/constants/widget-constants';
import type { DevToolsState, Position, WidgetPosition, WidgetSize, Theme } from '@/shared/types/widget-types';
import { validateOpacity, validatePosition, validateTheme } from '@/shared/utils/validation';

export const createDevToolsActions = (set: (fn: (state: DevToolsState) => Partial<DevToolsState>) => void) => ({
    setPosition: (position: Position) =>
        set((state) => ({
            position: validatePosition(position),
            widgetPosition: WIDGET_POSITIONS.CUSTOM,
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
}); 