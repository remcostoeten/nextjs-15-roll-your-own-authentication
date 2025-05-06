"use client"

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { ShortcutRecorder } from './ui/shortcut-recorder'
import { useKeyboardShortcuts, type Shortcut, type ShortcutCategory } from '@/lib/stores/keyboard-shortcuts'
import { Button } from './ui/button'

interface KeyboardShortcutsModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function KeyboardShortcutsModal({ open, onOpenChange }: KeyboardShortcutsModalProps) {
    const { shortcuts, resetShortcut } = useKeyboardShortcuts()

    const categories = React.useMemo(() => {
        const categorizedShortcuts = Object.values(shortcuts).reduce((acc, shortcut) => {
            if (!acc[shortcut.category]) {
                acc[shortcut.category] = []
            }
            acc[shortcut.category].push(shortcut)
            return acc
        }, {} as Record<ShortcutCategory, Shortcut[]>)

        return Object.entries(categorizedShortcuts)
    }, [shortcuts])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Keyboard Shortcuts</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue={categories[0]?.[0]}>
                    <TabsList className="grid w-full grid-cols-3">
                        {categories.map(([category]) => (
                            <TabsTrigger key={category} value={category} className="capitalize">
                                {category}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {categories.map(([category, shortcuts]) => (
                        <TabsContent key={category} value={category} className="space-y-4">
                            <div className="space-y-2">
                                {shortcuts.map((shortcut) => (
                                    <div
                                        key={shortcut.id}
                                        className="flex items-center justify-between rounded-lg border p-3"
                                    >
                                        <div>
                                            <div className="font-medium">{shortcut.description}</div>
                                            <div className="text-sm text-muted-foreground">
                                                Current: {shortcut.key}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => resetShortcut(shortcut.id)}
                                            >
                                                Reset
                                            </Button>
                                            <ShortcutRecorder shortcutId={shortcut.id} />
                                        </div>
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