"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { Plus, GitCommit, User, Calendar, ExternalLink, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { GitHubCommits } from "./github-commits"
import { ProjectMetrics } from "./project-metrics"

interface CommitData {
  sha: string
  html_url: string
  commit: {
    message: string
    author: {
      name: string
      email?: string
      date: string
    }
  }
  author?: {
    login: string
    avatar_url: string
  }
}

interface HeroProps {
  initialCommit?: CommitData | null
}

// Helper functions for formatting
const formatCommitMessage = (message: string) => {
  const lines = message.split("\n").filter((line) => line.trim() !== "")
  return {
    title: lines[0] || "",
    description: lines.slice(1) || [],
  }
}

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

const getRelativeTime = (dateString: string) => {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 30) {
      return formatDate(dateString)
    } else if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`
    } else {
      return "just now"
    }
  } catch (e) {
    return "recently"
  }
}

// Mock hook for GitHub commit data
const useGithubCommit = ({ initialCommit }: { initialCommit?: CommitData | null }) => {
  return {
    commit: initialCommit || {
      sha: "abcd1234efgh5678",
      html_url: "https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication/commit/abcd1234efgh5678",
      commit: {
        message: "Implement JWT authentication\n\nAdded secure token generation and validation",
        author: {
          name: "Developer",
          email: "dev@example.com",
          date: new Date().toISOString(),
        },
      },
      author: {
        login: "developer",
        avatar_url: "https://github.com/identicons/developer.png",
      },
    },
    isLoading: false,
    error: null,
  }
}

export function Hero({ initialCommit = null }: HeroProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const { commit: latestCommit, isLoading, error } = useGithubCommit({ initialCommit })
  const commitLinkRef = useRef<HTMLAnchorElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  // Define animation variants for consistent staggering
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
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

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        delay: i * 0.05,
      },
    }),
  }

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100,
      },
    },
  }

  // Split the title into words for staggered animation
  const titleWords = "Build secure authentication without the vendor lock-in.".split(" ")

  // Get formatted commit message
  const commitMessage = latestCommit ? formatCommitMessage(latestCommit.commit.message) : { title: "", description: [] }

  return (
    <motion.div className="relative px-6 pt-32" initial="hidden" animate="visible" variants={containerVariants}>
      {/* Plus icons */}
      <motion.div className="absolute left-4 top-4" variants={iconVariants}>
        <Plus className="h-4 w-4 text-[#1E1E1E]" />
      </motion.div>

      <motion.div className="absolute right-4 top-4" variants={iconVariants}>
        <Plus className="h-4 w-4 text-[#1E1E1E]" />
      </motion.div>

      {/* Roll Your Own Auth text */}
      <motion.div className="flex gap-2 text-sm text-[#8C877D]" variants={itemVariants}>
        <span>Roll Your Own Auth</span>
      </motion.div>

      {/* Hero title with staggered word animation */}
      <motion.h1 className="mt-4 max-w-2xl text-4xl font-normal tracking-tight" variants={itemVariants}>
        {titleWords.map((word, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={wordVariants}
            className="inline-block bg-gradient-to-b from-[#F2F0ED] to-[#ADADAD] bg-clip-text text-transparent"
            style={{ marginRight: "0.3em" }}
          >
            {word}
          </motion.span>
        ))}
      </motion.h1>

      {/* Command line with project metrics tooltip */}
      <motion.div
        className="mt-6 flex items-center gap-2 text-sm"
        variants={itemVariants}
        style={{ borderRight: "none", borderLeft: "none" }}
      >
        <ProjectMetrics>
          <div className="flex items-center">
            <span className="text-[#8C877D]">git:(</span>
            <span className="text-[#4e9815] italic">master</span>
            <span className="text-[#8C877D]">)</span>
            <span className="text-[#8C877D]">×</span>
            <span>nextjs-15-roll-your-own-authentication</span>
          </div>
        </ProjectMetrics>
        <GitHubCommits />
      </motion.div>

      {/* Latest commit info tagline */}
      <motion.div
        className="mt-2 flex items-center text-xs text-[#8C877D] relative min-h-[1.5rem]"
        variants={itemVariants}
      >
        {isLoading ? (
          <div className="flex items-center">
            <span className="mr-2 font-mono">$</span>
            <Loader2 className="h-3 w-3 animate-spin mr-2" />
            <span>Fetching latest commit...</span>
          </div>
        ) : error && !latestCommit ? (
          <div className="flex items-center">
            <span className="mr-2 font-mono">$</span>
            <span className="text-red-400">Error fetching commit: {error}</span>
          </div>
        ) : (
          latestCommit && (
            <>
              <span className="mr-2 font-mono">$</span>
              <span className="mr-1">Latest commit:</span>
              <a
                ref={commitLinkRef}
                href={latestCommit.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[#4e9815] hover:text-[#6bc427] hover:underline transition-colors duration-200 group relative"
                aria-label={`View commit: ${commitMessage.title}`}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <span>{commitMessage.title}</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4e9815] group-hover:w-full transition-all duration-300"></span>
              </a>
              <span className="ml-2 text-[#8C877D]">—</span>
              <span className="ml-2 text-[#8C877D] italic">
                {latestCommit.commit.author.date ? getRelativeTime(latestCommit.commit.author.date) : ""}
              </span>

              {/* Git info tooltip - positioned ABOVE the commit message */}
              <AnimatePresence>
                {showTooltip && (
                  <motion.div
                    ref={tooltipRef}
                    className="absolute left-24 bottom-8 z-[100] w-80 rounded-md border border-[#1E1E1E] bg-[#0D0C0C]/95 backdrop-blur-sm p-4 shadow-xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    style={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)" }}
                  >
                    {/* Arrow pointing DOWN */}
                    <div className="absolute -bottom-2 left-24 h-4 w-4 rotate-45 border-r border-b border-[#1E1E1E] bg-[#0D0C0C]"></div>

                    {/* Commit header */}
                    <div className="mb-3 border-b border-[#1E1E1E] pb-2">
                      <h4 className="text-sm font-medium text-[#F2F0ED]">Commit Details</h4>
                    </div>

                    {/* Commit info */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-2">
                        <GitCommit className="mt-0.5 h-3.5 w-3.5 text-[#4e9815]" />
                        <div>
                          <div className="text-[#8C877D]">Hash</div>
                          <div className="font-mono text-[#F2F0ED]">{latestCommit.sha.substring(0, 10)}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <User className="mt-0.5 h-3.5 w-3.5 text-[#4e9815]" />
                        <div>
                          <div className="text-[#8C877D]">Author</div>
                          <div className="text-[#F2F0ED]">
                            {latestCommit.author?.login || latestCommit.commit.author.name}
                            {latestCommit.commit.author.email && ` <${latestCommit.commit.author.email}>`}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Calendar className="mt-0.5 h-3.5 w-3.5 text-[#4e9815]" />
                        <div>
                          <div className="text-[#8C877D]">Date</div>
                          <div className="text-[#F2F0ED]">{formatDate(latestCommit.commit.author.date)}</div>
                        </div>
                      </div>

                      <div className="pt-1">
                        <div className="text-[#8C877D] mb-1">Message</div>
                        <div className="rounded-md bg-[#1E1E1E]/50 p-2 font-mono text-[#F2F0ED]">
                          {commitMessage.title}

                          {commitMessage.description.length > 0 && (
                            <div className="mt-2">
                              {commitMessage.description.map((line, index) => (
                                <div key={index} className="text-[#8C877D]">
                                  {line}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* View on GitHub link */}
                    <a
                      href={latestCommit.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex items-center justify-center gap-1 rounded-md border border-[#1E1E1E] px-3 py-1.5 text-xs text-[#4e9815] transition-colors hover:bg-[#1E1E1E]/50"
                    >
                      View on GitHub <ExternalLink className="h-3 w-3" />
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )
        )}
      </motion.div>

      {/* Buttons */}
      <motion.div
        className="mt-4 flex gap-4"
        variants={itemVariants}
        style={{ borderRight: "none", borderLeft: "none", position: "relative", zIndex: 2 }}
      >
        <Link
          href="/docs/getting-started"
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90 transition-colors duration-200"
        >
          GET STARTED
        </Link>
        <Link
          href="/examples"
          className="rounded-md border border-[#1E1E1E] px-4 py-2 text-sm font-medium hover:bg-[#1E1E1E] transition-colors duration-200"
        >
          View Auth Examples
        </Link>
      </motion.div>
    </motion.div>
  )
}

