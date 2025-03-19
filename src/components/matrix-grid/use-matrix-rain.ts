"use client"

import { useRef, useEffect } from "react"

export function useMatrixRain(isVisible = false) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)

    // Increase density of characters
    const fontSize = 16
    const columns = Math.floor(width / (fontSize * 0.6))
    const drops: number[] = []

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -height)
    }

    // Update the matrix function to have more intense green for the spotlight area
    const matrix = () => {
      if (!isVisible) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
          animationRef.current = null
        }
        return
      }

      // More transparent background for better spotlight effect
      ctx.fillStyle = "rgba(13, 12, 12, 0.1)"
      ctx.fillRect(0, 0, width, height)

      // Brighter green for better visibility in spotlight
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        // Use more varied characters for a richer effect
        const charCode = Math.floor(Math.random() * 94) + 33
        const text = String.fromCharCode(charCode)

        // Add some variation to the character brightness
        const brightness = Math.random() * 0.3 + 0.7 // 0.7 to 1.0 - brighter overall
        ctx.fillStyle = `rgba(78, 152, 21, ${brightness})`

        // Draw the character
        ctx.fillText(text, i * (fontSize * 0.6), drops[i] * 1)

        // Reset drops at random intervals
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0
        }

        // Speed up the drops
        drops[i] += 0.5 + Math.random() * 0.5
      }

      animationRef.current = requestAnimationFrame(matrix)
    }

    // Only start animation if visible
    if (isVisible) {
      matrix()
    }

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isVisible])

  return canvasRef
}

