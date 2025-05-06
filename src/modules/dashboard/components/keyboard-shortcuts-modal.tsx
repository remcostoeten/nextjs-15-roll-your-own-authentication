"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useKeyboardShortcuts, type KeyboardAction } from "../lib/keyboard-shortcuts"
import { KeyboardShortcutRecorder } from "./keyboard-shortcut-recorder"

interface KeyboardShortcutsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function KeyboardShortcutsModal({
  open,
  onOpenChange,
}: KeyboardShortcutsModalProps) {
  const { actions, shortcuts, updateShortcut, resetToDefault } = useKeyboardShortcuts()
  const [editingAction, setEditingAction] = useState<string | null>(null)

  const categories = Array.from(
    new Set(actions.map((action) => action.category))
  )

  const handleShortcutChange = (actionId: string, newKeys: string[]) => {
    updateShortcut(actionId, newKeys)
    setEditingAction(null)
  }

  const getShortcutDisplay = (action: KeyboardAction) => {
    const shortcut = shortcuts.find((s) => s.actionId === action.id)
    if (!shortcut) return ""

    return shortcut.keys
      .map((key) => {
        switch (key) {
          case "meta":
            return "⌘"
          case "ctrl":
            return "Ctrl"
          case "alt":
            return "Alt"
          case "shift":
            return "⇧"
          default:
            return key.charAt(0).toUpperCase() + key.slice(1)
        }
      })
      .join(" + ")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Customize keyboard shortcuts for various actions
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={categories[0]} className="mt-4">
          <TabsList>
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="capitalize"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-4">
              <div className="space-y-4">
                {actions
                  .filter((action) => action.category === category)
                  .map((action) => (
                    <div
                      key={action.id}
                      className="flex items-center justify-between py-2"
                    >
                      <div>
                        <h4 className="font-medium">{action.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                      </div>

                      {editingAction === action.id ? (
                        <KeyboardShortcutRecorder
                          value={
                            shortcuts.find((s) => s.actionId === action.id)
                              ?.keys || []
                          }
                          onChange={(keys) =>
                            handleShortcutChange(action.id, keys)
                          }
                          onCancel={() => setEditingAction(null)}
                        />
                      ) : (
                        <div
                          className="px-3 py-1 border rounded-md cursor-pointer hover:bg-accent"
                          onClick={() => setEditingAction(action.id)}
                        >
                          {getShortcutDisplay(action)}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 