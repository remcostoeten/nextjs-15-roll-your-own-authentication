'use client'

import { useEffect, useState } from "react"
import { useThemeStore } from "./use-theme-store"

export default function AnimatedBackground() {
  const { activeTheme } = useThemeStore()
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return <div className="fixed inset-0 -z-10 bg-black" />
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#030303]">
      <div
        className="absolute inset-0 transition-colors duration-300"
        style={{
          background: `radial-gradient(circle at 50% 50%, 
            ${activeTheme.gradient.from}15, 
            ${activeTheme.gradient.to}25)`,
          mixBlendMode: 'screen'
        }}
      />
    </div>
  )
}
