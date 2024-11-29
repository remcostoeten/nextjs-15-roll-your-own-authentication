'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

type CollapsibleProps = {
    title: string
    children: React.ReactNode
    defaultOpen?: boolean
    className?: string
}

export function Collapsible({ title, children, defaultOpen = false, className = '' }: CollapsibleProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen)

    return (
        <div className={`border border-border rounded-lg overflow-hidden ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full p-4 text-left bg-background/50 hover:bg-background/80 transition-colors"
            >
                <span className="font-medium">{title}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-4 h-4" />
                </motion.div>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="p-4 border-t border-border">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
