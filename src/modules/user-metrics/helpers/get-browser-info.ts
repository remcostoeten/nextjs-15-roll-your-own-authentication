export function getBrowserInfo() {
    if (typeof window === 'undefined') return null;
    return {
        userAgent: window.navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        language: window.navigator.language,
    };
}