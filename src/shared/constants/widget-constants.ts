export const WIDGET_CONSTANTS = {
    DEFAULT_POSITION: { x: 20, y: 20 },
    MIN_OPACITY: 0.2,
    MAX_OPACITY: 1,
    DEFAULT_OPACITY: 1,
    DEFAULT_SIZE: 'NORMAL',
    DEFAULT_THEME: 'dark',
    STORAGE_KEY: 'dev-tools-settings',
} as const;

export const WIDGET_POSITIONS = {
    TOP_LEFT: 'TOP_LEFT',
    TOP_RIGHT: 'TOP_RIGHT',
    BOTTOM_LEFT: 'BOTTOM_LEFT',
    BOTTOM_RIGHT: 'BOTTOM_RIGHT',
    CUSTOM: 'CUSTOM',
} as const;

export const WIDGET_SIZES = {
    SMALL: 'SMALL',
    NORMAL: 'NORMAL',
    LARGE: 'LARGE',
} as const; 