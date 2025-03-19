"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  Github,
  Menu,
  X,
  ChevronDown,
  Code,
  Terminal,
  Shield,
  Zap,
  BookOpen,
  FileCode,
  Layers,
  Settings,
  ExternalLink,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"

// Define the navigation items directly in this file with more comprehensive structure
const navItems = [
  {
    name: "_docs",
    href: "/docs",
    icon: <BookOpen className="h-4 w-4 mr-2 text-[#4e9815]" />,
    description: "Documentation and guides",
  },
  {
    name: "_changelog",
    href: "/changelog",
    icon: <FileCode className="h-4 w-4 mr-2 text-[#4e9815]" />,
    description: "Latest updates and changes",
  },
  {
    name: "_roadmap",
    href: "/roadmap",
    icon: <Layers className="h-4 w-4 mr-2 text-[#4e9815]" />,
    description: "Upcoming features and plans",
  },
  {
    name: "_demos",
    href: "#",
    icon: <Code className="h-4 w-4 mr-2 text-[#4e9815]" />,
    description: "Interactive examples and demos",
    isDropdown: true,
    items: [
      {
        name: "dev-tool",
        href: "/demos/dev-tool",
        icon: <Terminal className="h-4 w-4 mr-2 text-[#4e9815]" />,
        description: "Developer tools and utilities",
      },
      {
        name: "styleguide",
        href: "/demos/styleguide",
        icon: <Layers className="h-4 w-4 mr-2 text-[#4e9815]" />,
        description: "Design system and components",
      },
      {
        name: "security",
        href: "/demos/security",
        icon: <Shield className="h-4 w-4 mr-2 text-[#4e9815]" />,
        description: "Security features and best practices",
      },
      {
        name: "test",
        href: "/dev/test",
        icon: <Zap className="h-4 w-4 mr-2 text-[#4e9815]" />,
        description: "Testing environment",
      },
    ],
  },
  {
    name: "_settings",
    href: "/settings",
    icon: <Settings className="h-4 w-4 mr-2 text-[#4e9815]" />,
    description: "Configuration options",
  },
]

import { HackerMenuItem } from "./hacker-menu-item"

export function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const [matrixEffect, setMatrixEffect] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMenuOpen])

  // Matrix rain effect for dropdown background
  useEffect(() => {
    if (!matrixEffect || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const fontSize = 10
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(columns).fill(1)

    // Characters for matrix rain
    const chars = "01"

    const drawMatrixRain = () => {
      ctx.fillStyle = "rgba(13, 12, 12, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#0f0"
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(char, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i]++
      }

      animationRef.current = requestAnimationFrame(drawMatrixRain)
    }

    drawMatrixRain()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [matrixEffect])

  // Define animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  }

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  }

  const mobileMenuVariants = {
    hidden: { opacity: 0, x: "100%" },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200,
      },
    },
    exit: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200,
      },
    },
  }

  const dropdownVariants = {
    hidden: { opacity: 0, y: -5, height: 0 },
    visible: {
      opacity: 1,
      y: 0,
      height: "auto",
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
        staggerChildren: 0.05,
        delayChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      y: -5,
      height: 0,
      transition: {
        duration: 0.2,
      },
    },
  }

  const dropdownItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 200,
      },
    },
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b border-[#1E1E1E] bg-[#0D0C0C]/80 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-6">
        <motion.div variants={logoVariants} initial="hidden" animate="visible">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative h-5 w-5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <div className="absolute inset-0 rounded bg-white opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
              <div className="absolute inset-[2px] rounded bg-[#0D0C0C]"></div>
              <div className="absolute inset-[4px] rounded bg-[#4e9815] opacity-70 group-hover:opacity-80 group-hover:animate-pulse transition-opacity duration-300"></div>
              <div className="absolute inset-[6px] rounded bg-[#0D0C0C]"></div>
              <div className="absolute inset-[8px] rounded bg-white opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="bg-gradient-to-b from-[#F2F0ED] to-[#ADADAD] bg-clip-text text-transparent font-semibold group-hover:from-white group-hover:to-[#DADADA] transition-all duration-300">
              ROLL-YOUR-OWN-AUTH
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.nav
          className="hidden md:flex items-center gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {navItems.map((item) => (
            <motion.div
              key={item.name}
              variants={itemVariants}
              className="flex items-center justify-center relative"
              onMouseEnter={() => {
                if (item.isDropdown) {
                  setActiveDropdown(item.name)
                  setMatrixEffect(true)
                }
              }}
              onMouseLeave={() => {
                if (item.isDropdown) {
                  setActiveDropdown(null)
                  setMatrixEffect(false)
                }
              }}
            >
              {item.isDropdown ? (
                <>
                  <div className="flex items-center gap-1 cursor-pointer">
                    <HackerMenuItem
                      href={item.href}
                      text={item.name}
                      isActive={pathname.startsWith("/demos") || pathname.startsWith("/dev")}
                    />
                    <ChevronDown
                      className={`h-3 w-3 text-[#8C877D] mt-1 transition-transform duration-300 ${
                        activeDropdown === item.name ? "rotate-180 text-[#4e9815]" : ""
                      }`}
                    />
                  </div>

                  <AnimatePresence>
                    {activeDropdown === item.name && (
                      <motion.div
                        className="absolute top-full left-0 mt-1 w-64 rounded-md border border-[#1E1E1E] bg-[#0D0C0C] shadow-lg overflow-hidden z-50"
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        style={{
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.8), 0 0 10px rgba(78, 152, 21, 0.2)",
                        }}
                      >
                        {/* Matrix rain effect in background */}
                        <canvas
                          ref={canvasRef}
                          className="absolute inset-0 opacity-20 pointer-events-none"
                          aria-hidden="true"
                        />

                        <div className="py-2 relative z-10">
                          {item.items?.map((subItem) => (
                            <motion.div key={subItem.name} variants={dropdownItemVariants} className="relative">
                              <Link
                                href={subItem.href}
                                className={`block px-4 py-3 text-sm hover:bg-[#1E1E1E]/50 transition-colors duration-200 group relative overflow-hidden`}
                              >
                                {/* Hover effect */}
                                <div
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4e9815]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-full group-hover:translate-x-0 transform"
                                  style={{ transitionProperty: "opacity, transform", transitionDuration: "1s" }}
                                ></div>

                                <div className="flex items-start">
                                  <div className="flex-shrink-0 mt-0.5">{subItem.icon}</div>
                                  <div>
                                    <div
                                      className={`font-mono ${
                                        pathname === subItem.href
                                          ? "text-white"
                                          : "text-[#8C877D] group-hover:text-white transition-colors duration-200"
                                      }`}
                                    >
                                      {subItem.name}
                                    </div>
                                    <div className="text-xs text-[#8C877D] mt-0.5 font-light">
                                      {subItem.description}
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                        </div>

                        {/* Bottom terminal-like footer */}
                        <div className="border-t border-[#1E1E1E] bg-[#0D0C0C]/80 px-4 py-2 text-xs text-[#4e9815] font-mono flex items-center">
                          <Terminal className="h-3 w-3 mr-2" />
                          <span className="animate-pulse">_</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <div className="flex items-center">
                  {item.icon && (
                    <span className="hidden lg:inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item.icon}
                    </span>
                  )}
                  <HackerMenuItem href={item.href} text={item.name} isActive={pathname === item.href} />
                </div>
              )}
            </motion.div>
          ))}

          <motion.div variants={itemVariants}>
            <a
              href="https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center group relative"
            >
              <div className="absolute inset-0 rounded-full bg-[#4e9815]/0 group-hover:bg-[#4e9815]/10 transition-colors duration-300"></div>
              <Github className="h-5 w-5 text-[#8C877D] group-hover:text-white transition-colors duration-200" />
            </a>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-1.5 rounded-md border border-[#4e9815]/30 bg-[#4e9815]/10 text-[#4e9815] hover:bg-[#4e9815]/20 transition-all duration-200 relative overflow-hidden group"
            >
              {/* Animated border effect */}
              <div className="absolute inset-0 border border-[#4e9815]/0 group-hover:border-[#4e9815]/50 rounded-md transition-colors duration-500"></div>

              {/* Animated background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4e9815]/20 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-0 transition-all duration-1000"></div>

              <span className="relative z-10">Login</span>
              <span className="text-xs opacity-70 font-mono relative z-10">[ctrl+l]</span>
            </Link>
          </motion.div>
        </motion.nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-[#8C877D] hover:text-white transition-colors relative group"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <div className="absolute inset-0 rounded-full bg-[#4e9815]/0 group-hover:bg-[#4e9815]/10 transition-colors duration-300"></div>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 top-14 z-40 bg-[#0D0C0C]/95 backdrop-blur-md md:hidden"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex flex-col items-center justify-center h-full">
              <nav className="flex flex-col items-center gap-8 py-8 w-full max-w-sm mx-auto">
                {navItems.map((item) => (
                  <div key={item.name} className="flex flex-col items-center w-full">
                    {item.isDropdown ? (
                      <>
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                          className="flex items-center gap-2 text-[#8C877D] hover:text-white transition-colors duration-200 py-2"
                        >
                          {item.icon}
                          <span className="font-mono">{item.name}</span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-300 ${activeDropdown === item.name ? "rotate-180 text-[#4e9815]" : ""}`}
                          />
                        </button>

                        <AnimatePresence>
                          {activeDropdown === item.name && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden mt-2 w-full border border-[#1E1E1E] rounded-md"
                            >
                              <div className="flex flex-col items-start gap-1 py-2 bg-[#0D0C0C]/80">
                                {item.items?.map((subItem) => (
                                  <Link
                                    key={subItem.name}
                                    href={subItem.href}
                                    className={`text-sm w-full px-4 py-3 flex items-center gap-2 ${
                                      pathname === subItem.href
                                        ? "text-white bg-[#1E1E1E]"
                                        : "text-[#8C877D] hover:text-white hover:bg-[#1E1E1E]/50"
                                    } transition-colors duration-200`}
                                    onClick={() => setIsMenuOpen(false)}
                                  >
                                    {subItem.icon}
                                    <div>
                                      <div className="font-mono">{subItem.name}</div>
                                      <div className="text-xs text-[#8C877D]">{subItem.description}</div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={`flex items-center gap-2 py-2 ${
                          pathname === item.href ? "text-white" : "text-[#8C877D] hover:text-white"
                        } transition-colors duration-200`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.icon}
                        <span className="font-mono">{item.name}</span>
                      </Link>
                    )}
                  </div>
                ))}

                <div className="w-full border-t border-[#1E1E1E] my-4"></div>

                <a
                  href="https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-[#8C877D] hover:text-white transition-colors duration-200"
                >
                  <Github className="h-5 w-5" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="h-4 w-4" />
                </a>

                <Link
                  href="/login"
                  className="flex items-center gap-2 px-6 py-2 mt-6 rounded-md border border-[#4e9815]/30 bg-[#4e9815]/10 text-[#4e9815] hover:bg-[#4e9815]/20 transition-all duration-200 w-full justify-center"
                >
                  <span>Login</span>
                  <span className="text-xs opacity-70 font-mono">[ctrl+l]</span>
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

