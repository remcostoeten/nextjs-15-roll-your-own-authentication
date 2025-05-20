import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function StatsCard({ title, value, description, icon, trend }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {trend && (
          <div
            className={`mt-1 text-xs ${
              trend.isPositive ? "text-green-500" : trend.value === 0 ? "text-gray-500" : "text-red-500"
            } flex items-center`}
          >
            {trend.isPositive ? "↑" : trend.value === 0 ? "→" : "↓"} {Math.abs(trend.value)}%
            {trend.isPositive ? " increase" : trend.value === 0 ? " no change" : " decrease"}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
