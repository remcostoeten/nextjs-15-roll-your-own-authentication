"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Github, Mail, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { MatrixBackground } from "@/components/matrix-background"

export function LoginView() {
  const [isLoading, setIsLoading] = useState(false)
  const [showMoreProviders, setShowMoreProviders] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    // Handle login logic here
  }

  const handleOAuthLogin = (provider: string) => {
    // Handle OAuth login logic here
    console.log(`Logging in with ${provider}`)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0D0C0C] p-4 relative">
      <MatrixBackground opacity={0.05} />

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-b from-[#F2F0ED] to-[#ADADAD] bg-clip-text text-transparent mb-2">
            Access Terminal
          </h1>
          <p className="text-[#8C877D]">Enter your credentials to authenticate</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4"
        >
          {/* OAuth Providers */}
          <div className="space-y-2">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 border border-[#1E1E1E] rounded-md py-2 px-4 text-white bg-transparent hover:border-[#4e9815]/50 hover:bg-[#4e9815]/10 transition-all duration-200"
              onClick={() => handleOAuthLogin("github")}
            >
              <Github className="h-4 w-4" />
              <span>Continue with GitHub</span>
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 border border-[#1E1E1E] rounded-md py-2 px-4 text-white bg-transparent hover:border-[#4e9815]/50 hover:bg-[#4e9815]/10 transition-all duration-200"
              onClick={() => handleOAuthLogin("google")}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <AnimatePresence>
              {showMoreProviders && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 border border-[#1E1E1E] rounded-md py-2 px-4 text-white bg-transparent hover:border-[#4e9815]/50 hover:bg-[#4e9815]/10 transition-all duration-200 mt-2"
                    onClick={() => handleOAuthLogin("discord")}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"
                      />
                    </svg>
                    <span>Continue with Discord</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-1 text-[#8C877D] hover:text-[#F2F0ED] text-sm py-1"
              onClick={() => setShowMoreProviders(!showMoreProviders)}
            >
              {showMoreProviders ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  <span>Show less</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  <span>Show more</span>
                </>
              )}
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute w-full border-t border-[#1E1E1E]"></div>
            <span className="relative bg-[#0D0C0C] px-2 text-xs text-[#8C877D]">OR</span>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-[#8C877D] text-sm">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8C877D]" />
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-10 py-2 px-3 bg-transparent border border-[#1E1E1E] rounded-md focus:outline-none focus:border-[#4e9815]/50 focus:ring-1 focus:ring-[#4e9815]/10 text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-[#8C877D] text-sm">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-[#4e9815] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full py-2 px-3 bg-transparent border border-[#1E1E1E] rounded-md focus:outline-none focus:border-[#4e9815]/50 focus:ring-1 focus:ring-[#4e9815]/10 text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-[#4e9815]/30 rounded-md text-[#4e9815] bg-[#4e9815]/20 hover:bg-[#4e9815]/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4e9815]/50 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 text-center text-sm"
        >
          <span className="text-[#8C877D]">Don't have an account?</span>{" "}
          <Link href="/register" className="text-[#4e9815] hover:underline">
            Register
          </Link>
        </motion.div>

        {/* Matrix-inspired footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center text-xs text-[#8C877D] font-mono"
        >
          <span className="text-[#4e9815]">/* </span>
          Secure authentication with zero dependencies
          <span className="text-[#4e9815]"> */</span>
        </motion.div>
      </div>
    </div>
  )
}

