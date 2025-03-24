"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"

interface DropdownMenuItem {
  name: string
  href: string
  description?: string
  soon?: boolean
}

interface DropdownMenuProps {
  label: string
  items: DropdownMenuItem[]
}

export function DropdownMenu({ label, items }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrambledText, setScrambledText] = useState(label)
  const [isHovered, setIsHovered] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Characters for scrambling
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+~`|}{[]\\:;?><,./-="

  // Text scrambling effect
  useEffect(() => {
    if (!isHovered) {
      setScrambledText(label)
      return
    }

    let iteration = 0
    const maxIterations = 10 // Number of iterations before settling on the final text

    const interval = setInterval(() => {
      setScrambledText((prevText) => {
        // As iterations increase, more characters will be correct
        const correctChars = Math.floor((iteration / maxIterations) * label.length)

        return label
          .split("")
          .map((char, idx) => {
            // Keep spaces as spaces
            if (char === " ") return " "

            // If we've reached the correct iteration for this character, show the real character
            if (idx < correctChars) return label[idx]

            // Otherwise show a random character
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join("")
      })

      if (iteration >= maxIterations) {
        clearInterval(interval)
        setScrambledText(label)
      }

      iteration++
    }, 50)

    return () => {
      clearInterval(interval)
    }
  }, [isHovered, label])

  // Handle hover events
  const handleMouseEnter = () => {
    setIsHovered(true)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setIsOpen(false)
  }

  return (
    <div ref={menuRef} className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div
        className="flex items-center gap-1 text-[#8C877D] hover:text-white transition-colors duration-200 font-mono cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{scrambledText}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 mt-2 w-56 rounded-md border border-[#1E1E1E] bg-[#0D0C0C]/95 backdrop-blur-md shadow-lg z-50"
          >
            {/* Matrix code background */}
            <div
              className="absolute inset-0 opacity-5 rounded-md overflow-hidden"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='matrix' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Ctext x='0' y='15' fontFamily='monospace' fontSize='15' fill='%230f0' opacity='0.3'%3E0%3C/text%3E%3Ctext x='10' y='10' fontFamily='monospace' fontSize='10' fill='%230f0' opacity='0.3'%3E1%3C/text%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23matrix)'/%3E%3C/svg%3E\")",
                backgroundSize: "50px 50px",
              }}
            />

            <div className="relative z-10 py-1">
              {items.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-sm text-[#8C877D] hover:text-white hover:bg-[#1E1E1E] transition-colors duration-200"
                >
                  <div className="font-medium flex items-center justify-between">
                    {item.name}
                    {item.soon && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-[#1E1E1E] text-[#8C877D] border border-[#2D2D2D]">
                        Soon
                      </span>
                    )}
                  </div>
                  {item.description && <div className="text-xs text-[#8C877D] mt-0.5">{item.description}</div>}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

