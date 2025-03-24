"use client"

import { useEffect, useRef } from "react"

interface MatrixBackgroundProps {
  opacity?: number
}

export function MatrixBackground({ opacity = 0.05 }: MatrixBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Matrix rain settings
    const fontSize = 10
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(columns).fill(1)
    const chars = "01"

    const drawMatrixRain = () => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = `rgba(13, 12, 12, 0.05)`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#0f0"
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        // Random character (only 0 and 1 for binary look)
        const char = chars[Math.floor(Math.random() * chars.length)]

        // Draw the character
        ctx.fillText(char, i * fontSize, drops[i] * fontSize)

        // Reset drop when it reaches bottom or randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        // Move drop down
        drops[i]++
      }

      requestRef.current = requestAnimationFrame(drawMatrixRain)
    }

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    requestRef.current = requestAnimationFrame(drawMatrixRain)

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" style={{ opacity }} />
}

