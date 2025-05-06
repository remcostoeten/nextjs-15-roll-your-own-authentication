"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"

interface KeyboardShortcutRecorderProps {
  value: string[]
  onChange: (keys: string[]) => void
  onCancel: () => void
}

export function KeyboardShortcutRecorder({
  value,
  onChange,
  onCancel,
}: KeyboardShortcutRecorderProps) {
  const [recording, setRecording] = useState(false)
  const [keys, setKeys] = useState<string[]>(value)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!recording) return

      e.preventDefault()

      const key = e.key.toLowerCase()
      const modifiers = [
        e.ctrlKey && "ctrl",
        e.shiftKey && "shift",
        e.altKey && "alt",
        e.metaKey && "meta",
      ].filter(Boolean) as string[]

      // Ignore standalone modifier keys
      if (["control", "shift", "alt", "meta"].includes(key)) {
        return
      }

      const newKeys = [...modifiers, key]
      setKeys(newKeys)
      onChange(newKeys)
      setRecording(false)
    },
    [recording, onChange]
  )

  useEffect(() => {
    if (recording) {
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  }, [recording, handleKeyDown])

  const formatKeys = (keys: string[]) =>
    keys
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

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={recording ? "destructive" : "outline"}
        onClick={() => setRecording(!recording)}
      >
        {recording ? "Recording..." : "Record Shortcut"}
      </Button>
      <div className="min-w-[100px] px-3 py-1 border rounded-md bg-muted">
        {formatKeys(keys)}
      </div>
      <Button variant="ghost" size="sm" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  )
} 