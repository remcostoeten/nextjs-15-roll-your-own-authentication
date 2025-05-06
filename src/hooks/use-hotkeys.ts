import { useEffect } from 'react';

type HotkeyCallback = () => void;
type HotkeyTuple = [string, HotkeyCallback];

const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

function parseHotkey(hotkey: string): { key: string; modifiers: string[] } {
    const parts = hotkey.toLowerCase().split('+');
    const key = parts.pop() as string;
    const modifiers = parts.map(mod => mod === 'mod' ? (isMac ? 'meta' : 'ctrl') : mod);
    return { key, modifiers };
}

export function useHotkeys(hotkeys: HotkeyTuple[]) {
    const handleKeyDown = (event: KeyboardEvent) => {
        for (const [hotkey, callback] of hotkeys) {
            const { key, modifiers } = parseHotkey(hotkey);
            
            const isKeyMatch = event.key.toLowerCase() === key;
            const areModifiersMatch = modifiers.every(mod => {
                if (mod === 'meta') return event.metaKey;
                if (mod === 'ctrl') return event.ctrlKey;
                if (mod === 'alt') return event.altKey;
                if (mod === 'shift') return event.shiftKey;
                return false;
            });

            if (isKeyMatch && areModifiersMatch) {
                event.preventDefault();
                callback();
            }
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [hotkeys]);
} 