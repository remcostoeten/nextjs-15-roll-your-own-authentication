import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ShortcutCategory = 'navigation' | 'actions' | 'system'

export interface Shortcut {
    id: string
    key: string
    category: ShortcutCategory
    description: string
    defaultKey: string
    action: () => void
}

interface KeyboardShortcutsState {
    shortcuts: Record<string, Shortcut>
    isRecording: boolean
    currentRecordingId: string | null
    addShortcut: (shortcut: Shortcut) => void
    updateShortcut: (id: string, key: string) => void
    resetShortcut: (id: string) => void
    startRecording: (id: string) => void
    stopRecording: () => void
}

export const useKeyboardShortcuts = create<KeyboardShortcutsState>()(
    persist(
        (set, get) => ({
            shortcuts: {},
            isRecording: false,
            currentRecordingId: null,
            addShortcut: (shortcut) =>
                set((state) => ({
                    shortcuts: {
                        ...state.shortcuts,
                        [shortcut.id]: shortcut,
                    },
                })),
            updateShortcut: (id, key) =>
                set((state) => ({
                    shortcuts: {
                        ...state.shortcuts,
                        [id]: {
                            ...state.shortcuts[id],
                            key,
                        },
                    },
                })),
            resetShortcut: (id) =>
                set((state) => ({
                    shortcuts: {
                        ...state.shortcuts,
                        [id]: {
                            ...state.shortcuts[id],
                            key: state.shortcuts[id].defaultKey,
                        },
                    },
                })),
            startRecording: (id) =>
                set({
                    isRecording: true,
                    currentRecordingId: id,
                }),
            stopRecording: () =>
                set({
                    isRecording: false,
                    currentRecordingId: null,
                }),
        }),
        {
            name: 'keyboard-shortcuts',
        }
    )
) 