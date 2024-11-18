'use client'

import { useThemeStore } from "@/core/stores/theme-store"
import { useEffect, useState } from "react"
import { THEME_PRESETS } from "./gradient-presets"

type MousePosition = {
  x: number
  y: number
}

export default function AnimatedBackground() {
  const { currentTheme, animation, gradient } = useThemeStore()
  const [mouse, setMouse] = useState<MousePosition>({ x: 0, y: 0 })
  const [isHydrated, setIsHydrated] = useState(false)

  // Get colors from current theme preset
  const colors = THEME_PRESETS[currentTheme]?.colors || {
    background: '#030303', // Changed to match your dark background
    primary: '#000000',
    secondary: '#000000',
    accent1: '#000000',
    accent2: '#000000'
  }

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight
      setMouse({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const getGradientString = (mouse: MousePosition): string => {
    const { x, y } = mouse
    const gradient = `radial-gradient(circle at ${x * 100}% ${y * 100}%, ${colors.primary}, ${colors.secondary})`
    return gradient
  }

  if (!isHydrated) {
    return (
      <div 
        className="fixed inset-0 -z-10 bg-[#030303]" // Default dark background
      />
    )
  }

  return (
    <>
      <div 
        className="fixed inset-0 -z-10 transition-colors duration-1000"
        style={{
          backgroundColor: colors.background,
        }}
      />
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: getGradientString(mouse),
          transition: `all ${animation.duration}s ${animation.ease}`,
        }}
      />
    </>
  )
}