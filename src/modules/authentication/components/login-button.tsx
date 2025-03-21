"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Terminal } from "lucide-react"

export function LoginButton() {
  const [isHovered, setIsHovered] = useState(() => false)
  const [scrambledText, setScrambledText] = useState("Login")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number>()

  // Characters for scrambling
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+~`|}{[]\\:;?><,./-="

  // Text scrambling effect
  useEffect(() => {
    if (!isHovered) {
      setScrambledText("Login")
      return
    }

    let iteration = 0
    const maxIterations = 5 // Fewer iterations for faster effect
    const interval = setInterval(() => {
      setScrambledText(
        "Login"
          .split("")
          .map((char, idx) => {
            if (Math.random() > iteration / maxIterations) {
              return chars[Math.floor(Math.random() * chars.length)]
            }
            return char
          })
          .join(""),
      )

      iteration += 1
      if (iteration >= maxIterations) {
        clearInterval(interval)
        setScrambledText("Login")
      }
    }, 50)

    return () => clearInterval(interval)
  }, [isHovered])

  // Matrix rain effect
  useEffect(() => {
    if (!isHovered || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const fontSize = 8
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(columns).fill(1)

    // Binary characters for matrix effect
    const chars = "01"

    const drawMatrixRain = () => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = "rgba(13, 12, 12, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#0f0"
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        // Random character (only 0 and 1 for binary look)
        const char = chars[Math.floor(Math.random() * chars.length)]

        // Draw the character
        ctx.fillText(char, i * fontSize, drops[i] * fontSize)

        // Reset drop when it reaches bottom or randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
          drops[i] = 0
        }

        // Move drop down
        drops[i]++
      }

      requestRef.current = requestAnimationFrame(drawMatrixRain)
    }

    requestRef.current = requestAnimationFrame(drawMatrixRain)

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [isHovered])

  return (
    <Link href="/login">
      <motion.div
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 1 }}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.2 }}
        style={{
          // Fixed width container to prevent layout shifts
          width: "120px", // Adjust this value based on your needs
          height: "36px"  // Adjust this value based on your needs
        }}
      >
        {/* Matrix-style background with canvas for rain effect */}
        <div className="absolute inset-0 rounded-md overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"
          />
        </div>

        {/* Glowing border effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4e9815]/30 to-[#4e9815]/10 rounded-md blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Button content */}
        <div className="relative flex items-center justify-center h-full px-4 rounded-md border border-[#4e9815]/30 bg-[#0D0C0C] text-[#4e9815] transition-all duration-200">
          <Terminal className="h-3.5 w-3.5" />
          <span className="font-mono mx-2 min-w-[40px] text-center">{scrambledText}</span>
          <span className="text-xs opacity-70 font-mono">[ctrl+l]</span>

          {/* Animated caret */}
          <motion.span
            className="h-3.5 w-0.5 bg-[#4e9815] opacity-0 group-hover:opacity-70 absolute right-2"
            animate={{ opacity: [0, 0.7, 0] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
          ></motion.span>
        </div>

        {/* Pulse effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-md border border-[#4e9815]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          animate={
            isHovered
              ? {
                  borderColor: ["rgba(78, 152, 21, 0)", "rgba(78, 152, 21, 0.5)", "rgba(78, 152, 21, 0)"],
                  boxShadow: [
                    "0 0 0px rgba(78, 152, 21, 0)",
                    "0 0 10px rgba(78, 152, 21, 0.3)",
                    "0 0 0px rgba(78, 152, 21, 0)",
                  ],
                }
              : {}
          }
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />
      </motion.div>
    </Link>
  )
}

