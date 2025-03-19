"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

interface HackerMenuItemProps {
  href: string
  text: string
  isActive: boolean
  className?: string
}

// Characters to use for the scramble effect
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+~`|}{[]\\:;?><,./-="

export function HackerMenuItem({ href, text, isActive, className = "" }: HackerMenuItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isTouched, setIsTouched] = useState(false)
  const [scrambledText, setScrambledText] = useState(text)
  const containerRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout>()

  // Text scrambling effect
  useEffect(() => {
    if (!isHovered && !isTouched) {
      setScrambledText(text)
      return
    }

    let iteration = 0
    const maxIterations = 10 // Number of iterations before settling on the final text

    intervalRef.current = setInterval(() => {
      setScrambledText((prevText) => {
        // As iterations increase, more characters will be correct
        const correctChars = Math.floor((iteration / maxIterations) * text.length)

        return text
          .split("")
          .map((char, idx) => {
            // Keep spaces as spaces
            if (char === " ") return " "

            // If we've reached the correct iteration for this character, show the real character
            if (idx < correctChars) return text[idx]

            // Otherwise show a random character
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join("")
      })

      if (iteration >= maxIterations) {
        clearInterval(intervalRef.current)
        setScrambledText(text)
      }

      iteration++
    }, 50)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isHovered, isTouched, text])

  // Reset touch state after animation completes
  useEffect(() => {
    if (isTouched) {
      const timer = setTimeout(() => {
        setIsTouched(false)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [isTouched])

  return (
    <motion.div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsTouched(true)}
      whileHover={{ scale: 1.05 }}
      style={{
        // Use a monospace font to prevent width changes during scrambling
        fontFamily: "monospace",
        // Set a fixed width based on the original text to prevent layout shifts
        width: `${text.length * 0.65}em`,
        // Ensure text is centered within the fixed width
        textAlign: "center",
        // Prevent layout shifts by maintaining a consistent height
        height: "1.5em",
        // Ensure the container doesn't collapse
        display: "inline-block",
      }}
    >
      {/* Invisible original text to maintain layout */}
      <span className="invisible absolute inset-0" aria-hidden="true" style={{ fontFamily: "monospace" }}>
        {text}
      </span>

      {/* Visible link with scrambled text */}
      <Link
        href={href}
        className={`absolute inset-0 flex items-center justify-center transition-colors duration-200 ${
          isActive ? "text-white" : "text-[#8C877D] hover:text-white"
        }`}
        style={{ fontFamily: "monospace" }}
      >
        {scrambledText}
      </Link>

      {/* Green glow effect on hover */}
      <div
        className={`absolute inset-0 -z-20 rounded-full bg-[#0f0] blur-xl opacity-0 transition-opacity duration-300 ${
          isHovered || isTouched ? "opacity-10" : ""
        }`}
        aria-hidden="true"
      />

      {/* Underline effect */}
      <div
        className={`absolute bottom-0 left-0 h-[1px] bg-[#4e9815] transition-all duration-300 ${
          isHovered || isActive ? "w-full" : "w-0"
        }`}
        aria-hidden="true"
      />
    </motion.div>
  )
}

