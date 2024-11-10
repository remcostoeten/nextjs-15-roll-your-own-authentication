'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

type ActivityChartProps = {
  data: number[]
  selectedTimeRange: string
  className?: string
}

export default function ActivityChart({
  data,
  selectedTimeRange,
  className
}: ActivityChartProps) {
  const [maxValue, setMaxValue] = useState(0)
  const [normalizedData, setNormalizedData] = useState<number[]>([])

  useEffect(() => {
    if (data.length === 0) return

    const max = Math.max(...data)
    setMaxValue(max)
    setNormalizedData(data.map(value => (value / max) * 100))
  }, [data])

  const getTimeLabels = () => {
    switch (selectedTimeRange) {
      case 'week':
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      case 'month':
        return Array.from({ length: 31 }, (_, i) => (i + 1).toString())
      case 'quarter':
        return Array.from({ length: 12 }, (_, i) => {
          const date = new Date()
          date.setMonth(date.getMonth() - i)
          return date.toLocaleString('default', { month: 'short' })
        }).reverse()
      default:
        return []
    }
  }

  if (data.length === 0) {
    return (
      <div className={cn('h-48 flex items-center justify-center', className)}>
        <p className="text-neutral-500">No activity data available</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="h-48 flex items-end gap-1">
        {normalizedData.map((value, index) => (
          <motion.div
            key={index}
            className="flex-1 bg-gradient-to-t from-purple-500/50 to-purple-500 rounded-t"
            initial={{ height: 0 }}
            animate={{ height: `${Math.max(value, 2)}%` }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              delay: index * 0.02
            }}
          >
            <div className="w-full h-full relative group">
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap">
                {data[index]} commits
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Time labels */}
      <div className="flex justify-between text-xs text-neutral-500 pt-2">
        {getTimeLabels().map((label, index) => (
          <div
            key={index}
            className="flex-1 text-center truncate"
            style={{ fontSize: '0.7rem' }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  )
} 
