/**
 * @description A hook for being able to drag a widget around the screen and maintain the position after the drag has ended in local storage
 * @author Remco Stoeten
 */

import { useState, useCallback } from 'react'

interface Position {
    x: number
    y: number
}

interface UseDragProps {
    allowDrag: boolean
    onDragStart?: () => void
    onDragEnd?: () => void
}

export function useWidgetDrag({ allowDrag, onDragStart, onDragEnd }: UseDragProps) {
    const [dragPosition, setDragPosition] = useState<Position>({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)

    const handleDragStart = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        if (!allowDrag) return

        event.preventDefault()
        const startPos = { x: event.clientX - dragPosition.x, y: event.clientY - dragPosition.y }

        function handleDrag(e: MouseEvent) {
            setDragPosition({
                x: e.clientX - startPos.x,
                y: e.clientY - startPos.y
            })
        }

        function handleDragEnd() {
            document.removeEventListener('mousemove', handleDrag)
            document.removeEventListener('mouseup', handleDragEnd)
            setIsDragging(false)
            onDragEnd?.()
        }

        setIsDragging(true)
        onDragStart?.()
        document.addEventListener('mousemove', handleDrag)
        document.addEventListener('mouseup', handleDragEnd)
    }, [allowDrag, dragPosition, onDragStart, onDragEnd])

    return {
        dragPosition,
        isDragging,
        handleDragStart
    }
} 