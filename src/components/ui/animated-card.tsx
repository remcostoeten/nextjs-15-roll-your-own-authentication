'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Card } from './card'
import { useId } from 'react'

interface AnimatedCardProps extends React.ComponentProps<typeof Card> {
    index?: number
    layoutId?: string
}

export function AnimatedCard({ 
    children, 
    className,
    index = 0,
    layoutId: propLayoutId,
    ...props 
}: AnimatedCardProps) {
    const uniqueId = useId()
    const layoutId = propLayoutId || uniqueId

    return (
        <motion.div
            layout
            layoutId={layoutId}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                delay: index * 0.05
            }}
        >
            <Card className={className} {...props}>
                {children}
            </Card>
        </motion.div>
    )
}

export function AnimatedCardList({ children }: { children: React.ReactNode }) {
    return (
        <AnimatePresence mode="popLayout">
            {children}
        </AnimatePresence>
    )
} 