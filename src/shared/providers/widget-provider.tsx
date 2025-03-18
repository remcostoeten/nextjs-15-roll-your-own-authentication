'use client'

import React, { createContext, ReactNode, useContext, useState } from 'react'
import { DevToolsWidget } from '@/modules/widgets/dev-tools/components/dev-tools-widget'

type WidgetContextType = {
    isDevToolVisible: boolean
    toggleDevTool: () => void
}

const WidgetContext = createContext<WidgetContextType | undefined>(undefined)

export const useWidgets = () => {
    const context = useContext(WidgetContext)
    if (!context) {
        throw new Error('useWidgets must be used within a WidgetProvider')
    }
    return context
}

export function WidgetProvider({ children }: { children: ReactNode }) {
    const [isDevToolVisible, setIsDevToolVisible] = useState(true)

    const toggleDevTool = () => {
        console.log('Toggling DevTool, current state:', isDevToolVisible)
        setIsDevToolVisible(prev => !prev)
    }

    console.log('Widget states:', { isDevToolVisible })

    return (
        <WidgetContext.Provider
            value={{
                isDevToolVisible,
                toggleDevTool,
            }}
        >
            {children}

            {/* Dev Tool Widget - Always visible */}
            <div className="fixed inset-0 z-[9998] pointer-events-none">
                <div className="pointer-events-auto">
                    <DevToolsWidget allowDrag showInProduction />
                </div>
            </div>
        </WidgetContext.Provider>
    )
} 