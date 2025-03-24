"use client"

import { useEffect, useRef } from "react"
import { MATRIX_GRID_CONFIG } from "../config/matrix-grid-config"

export function useMatrixRain(enabled: boolean) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!enabled || !MATRIX_GRID_CONFIG.MATRIX_RAIN.ENABLED) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Reduce density by increasing spacing between columns
    const columnSpacing = 3 // Show a column every 3 positions
    const columns = Math.ceil(canvas.width / (MATRIX_GRID_CONFIG.MATRIX_RAIN.FONT_SIZE * columnSpacing))
    const drops: number[] = []

    // Initialize drops with random starting positions for a staggered effect
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor((Math.random() * canvas.height) / MATRIX_GRID_CONFIG.MATRIX_RAIN.FONT_SIZE)
    }

    const matrix = MATRIX_GRID_CONFIG.MATRIX_RAIN.CHARACTERS

    function draw() {
      // More transparent background for a subtle fade effect
      ctx.fillStyle = "rgba(13, 12, 12, 0.2)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = MATRIX_GRID_CONFIG.MATRIX_RAIN.COLOR
      ctx.font = `${MATRIX_GRID_CONFIG.MATRIX_RAIN.FONT_SIZE}px monospace`

      // Draw characters with reduced density
      for (let i = 0; i < drops.length; i++) {
        // Only draw if random check passes (30% chance) - creates varied density
        if (Math.random() > 0.7) {
          const text = matrix[Math.floor(Math.random() * matrix.length)]
          ctx.fillText(
            text,
            i * MATRIX_GRID_CONFIG.MATRIX_RAIN.FONT_SIZE * columnSpacing,
            drops[i] * MATRIX_GRID_CONFIG.MATRIX_RAIN.FONT_SIZE,
          )
        }

        // Reset drops with varied probability for a more natural flow
        if (drops[i] * MATRIX_GRID_CONFIG.MATRIX_RAIN.FONT_SIZE > canvas.height && Math.random() > 0.98) {
          drops[i] = 0
        }

        // Slow down the drop speed by incrementing less
        drops[i] += 0.5
      }
    }

    const interval = setInterval(draw, MATRIX_GRID_CONFIG.MATRIX_RAIN.SPEED)

    return () => clearInterval(interval)
  }, [enabled])

  return canvasRef
}

