"use client"

import * as React from 'react'
import { Button } from './button'
import { useKeyboardShortcuts } from '@/lib/stores/keyboard-shortcuts'

interface ShortcutRecorderProps {
    shortcutId: string
    onRecorded?: (key: string) => void
}

export function ShortcutRecorder({ shortcutId, onRecorded }: ShortcutRecorderProps) {
    const { startRecording, stopRecording, isRecording, currentRecordingId, updateShortcut } = useKeyboardShortcuts()
    const isCurrentlyRecording = isRecording && currentRecordingId === shortcutId

    React.useEffect(() => {
        if (!isCurrentlyRecording) return

        const handleKeyDown = (e: KeyboardEvent) => {
            e.preventDefault()

            const modifiers: string[] = []
            if (e.ctrlKey) modifiers.push('Ctrl')
            if (e.metaKey) modifiers.push('Cmd')
            if (e.altKey) modifiers.push('Alt')
            if (e.shiftKey) modifiers.push('Shift')

            const key = e.key.toUpperCase()
            if (!['CONTROL', 'META', 'ALT', 'SHIFT'].includes(key)) {
                const shortcutKey = [...modifiers, key].join('+')
                updateShortcut(shortcutId, shortcutKey)
                onRecorded?.(shortcutKey)
                stopRecording()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isCurrentlyRecording, onRecorded, shortcutId, stopRecording, updateShortcut])

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={() => {
                if (isCurrentlyRecording) {
                    stopRecording()
                } else {
                    startRecording(shortcutId)
                }
            }}
        >
            {isCurrentlyRecording ? 'Recording...' : 'Record Shortcut'}
        </Button>
    )
} 