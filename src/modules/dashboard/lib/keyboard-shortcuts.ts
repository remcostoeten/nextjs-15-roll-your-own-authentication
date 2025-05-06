import { create } from "zustand"
import { persist } from "zustand/middleware"

export type KeyboardAction = {
  id: string
  name: string
  description: string
  defaultShortcut: string[]
  category: "navigation" | "actions" | "system"
  handler: () => void
}

export type KeyboardShortcut = {
  actionId: string
  keys: string[]
}

type KeyboardShortcutsStore = {
  shortcuts: KeyboardShortcut[]
  actions: KeyboardAction[]
  registerAction: (action: KeyboardAction) => void
  unregisterAction: (actionId: string) => void
  updateShortcut: (actionId: string, newKeys: string[]) => void
  resetToDefault: (actionId: string) => void
  getShortcut: (actionId: string) => string[] | undefined
}

export const useKeyboardShortcuts = create<KeyboardShortcutsStore>()(
  persist(
    (set, get) => ({
      shortcuts: [],
      actions: [],
      registerAction: (action) =>
        set((state) => ({
          actions: [...state.actions, action],
          shortcuts: [
            ...state.shortcuts,
            { actionId: action.id, keys: action.defaultShortcut },
          ],
        })),
      unregisterAction: (actionId) =>
        set((state) => ({
          actions: state.actions.filter((a) => a.id !== actionId),
          shortcuts: state.shortcuts.filter((s) => s.actionId !== actionId),
        })),
      updateShortcut: (actionId, newKeys) =>
        set((state) => ({
          shortcuts: state.shortcuts.map((s) =>
            s.actionId === actionId ? { ...s, keys: newKeys } : s
          ),
        })),
      resetToDefault: (actionId) =>
        set((state) => ({
          shortcuts: state.shortcuts.map((s) =>
            s.actionId === actionId
              ? {
                  ...s,
                  keys:
                    state.actions.find((a) => a.id === actionId)?.defaultShortcut ||
                    s.keys,
                }
              : s
          ),
        })),
      getShortcut: (actionId) =>
        get().shortcuts.find((s) => s.actionId === actionId)?.keys,
    }),
    {
      name: "keyboard-shortcuts",
    }
  )
) 