"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { fetchLatestCommits } from "@/app/actions/github"

interface Commit {
  sha: string
  message: string
  author: string
  authorAvatar: string
  date: string
  url: string
}

// Cache key for localStorage
const CACHE_KEY = "github-commits-cache"
const CACHE_EXPIRY_KEY = "github-commits-cache-expiry"
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

export function GitHubCommits() {
  const [activeSquare, setActiveSquare] = useState<number | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<"top" | "bottom">("top")
  const [commits, setCommits] = useState<Commit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<"api" | "cache" | null>(null)

  const squareRefs = useRef<Array<HTMLDivElement | null>>([])
  const tooltipRef = useRef<HTMLDivElement | null>(null)

  const squares = [
    { opacity: 1, bg: "bg-[#4e9815]" },
    { opacity: 0.75, bg: "bg-[#4e9815]/75" },
    { opacity: 0.5, bg: "bg-[#4e9815]/50" },
    { opacity: 0.25, bg: "bg-[#4e9815]/25" },
    { opacity: 0.1, bg: "bg-[#4e9815]/10" },
  ]

  useEffect(() => {
    async function fetchCommits() {
      try {
        // Check for cached data first
        if (typeof window !== "undefined") {
          const cachedData = localStorage.getItem(CACHE_KEY)
          const cacheExpiry = localStorage.getItem(CACHE_EXPIRY_KEY)

          // Use cache if it exists and hasn't expired
          if (cachedData && cacheExpiry && Date.now() < Number.parseInt(cacheExpiry)) {
            setCommits(JSON.parse(cachedData))
            setDataSource("cache")
            setIsLoading(false)
            console.log("Using cached GitHub commits data")
            return
          }
        }

        const result = await fetchLatestCommits("remcostoeten/nextjs-15-roll-your-own-authentication", "main", 5)
        
        // Cache the results
        if (typeof window !== "undefined") {
          localStorage.setItem(CACHE_KEY, JSON.stringify(result.commits))
          localStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString())
        }

        setCommits(result.commits)
        setDataSource("api")
        setError(null)
        console.log("Fetched fresh GitHub commits data")
      } catch (err) {
        console.error("Error fetching GitHub commits:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch commits")
        setCommits([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCommits()
  }, [])

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (e) {
      return dateString
    }
  }

  // Format commit message to show only the first line
  const formatMessage = (message: string) => {
    return message.split("\n")[0]
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm">
        Failed to load commits: {error}
      </div>
    )
  }

  return (
    <div className="relative ml-2 flex gap-1">
      {squares.map((square, index) => (
        <div
          key={index}
          className="relative"
          ref={(el) => {
            squareRefs.current[index] = el
          }}
          onMouseEnter={() => setActiveSquare(index)}
          onMouseLeave={() => setActiveSquare(null)}
        >
          <div
            className={`h-4 w-4 rounded cursor-pointer transition-all duration-200 ${
              activeSquare === index ? "bg-[#4e9815]" : square.bg
            }`}
          />

          <AnimatePresence>
            {activeSquare === index && (
              <motion.div
                ref={tooltipRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`
                  absolute bottom-full
                  left-0 z-[9999] w-64 rounded border border-[#1E1E1E] 
                  bg-[#0D0C0C] p-3 text-xs shadow-lg mb-2
                `}
              >
                {/* Arrow */}
                <div
                  className={`
                    absolute left-2 h-2 w-2 rotate-45 border border-[#1E1E1E] bg-[#0D0C0C]
                    -bottom-1 border-l-0 border-t-0
                  `}
                />

                {isLoading ? (
                  <p className="text-[#8C877D]">Loading commits...</p>
                ) : commits.length > 0 && index < commits.length ? (
                  <>
                    <p className="mb-1 text-[#8C877D]">{commits[index].sha.substring(0, 7)}</p>
                    <p className="mb-2 text-[#F2F0ED]">{formatMessage(commits[index].message)}</p>
                    <div className="flex items-center gap-2 text-[#8C877D]">
                      {commits[index].authorAvatar && (
                        <img
                          src={commits[index].authorAvatar || "/placeholder.svg"}
                          alt={commits[index].author}
                          className="h-4 w-4 rounded-full"
                        />
                      )}
                      <span>
                        {commits[index].author} • {formatDate(commits[index].date)}
                      </span>
                    </div>
                    <a
                      href={commits[index].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 block text-[#4e9815] hover:underline"
                    >
                      View on GitHub
                    </a>

                    {dataSource === "cache" && (
                      <p className="mt-2 text-[10px] text-[#8C877D] italic">Using cached data</p>
                    )}
                  </>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

