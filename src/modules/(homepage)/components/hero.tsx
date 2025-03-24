"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Plus, GitCommit, User, Calendar, ExternalLink, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { GitHubCommits } from "./github-commits"
import { ProjectMetrics } from "./project-metrics"
import { useGithubCommit } from "../../github/hooks/use-github-commit"
import { formatCommitMessage, formatDate, getRelativeTime } from "../../../shared/helpers/date-helpers"
import type { CommitData } from "../../github/api/queries/fetch-latest-commit"
import { GitHubRepoCard } from "./github-repo-card-static"

interface HeroProps {
  initialCommit?: CommitData | null
}

export function Hero({ initialCommit = null }: HeroProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [showRepoCard, setShowRepoCard] = useState(false)
  const { commit: latestCommit, isLoading, error } = useGithubCommit({ initialCommit })
  const commitLinkRef = useRef<HTMLAnchorElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const commitsRef = useRef<HTMLDivElement>(null)
  const [tooltipPosition, setTooltipPosition] = useState<"top" | "bottom" | "left" | "right">("top")
  const [repoCardPosition, setRepoCardPosition] = useState<"top" | "bottom">("bottom")

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

  // Calculate tooltip position based on viewport
  useEffect(() => {
    if (!showTooltip || !commitLinkRef.current) return

    const updateTooltipPosition = () => {
      const linkRect = commitLinkRef.current?.getBoundingClientRect()
      const tooltipRect = tooltipRef.current?.getBoundingClientRect()

      if (!linkRect || !tooltipRect) return

      const viewportHeight = window.innerHeight
      const viewportWidth = window.innerWidth

      // Check if tooltip would overflow at the bottom
      const wouldOverflowBottom = linkRect.bottom + tooltipRect.height > viewportHeight
      // Check if tooltip would overflow at the top
      const wouldOverflowTop = linkRect.top - tooltipRect.height < 0
      // Check if tooltip would overflow at the right
      const wouldOverflowRight = linkRect.right + tooltipRect.width > viewportWidth
      // Check if tooltip would overflow at the left
      const wouldOverflowLeft = linkRect.left - tooltipRect.width < 0

      // Determine best position
      if (!wouldOverflowTop) {
        setTooltipPosition("top")
      } else if (!wouldOverflowBottom) {
        setTooltipPosition("bottom")
      } else if (!wouldOverflowRight) {
        setTooltipPosition("right")
      } else if (!wouldOverflowLeft) {
        setTooltipPosition("left")
      } else {
        // Default to top if all positions would overflow
        setTooltipPosition("top")
      }
    }

    updateTooltipPosition()
    window.addEventListener("resize", updateTooltipPosition)
    return () => window.removeEventListener("resize", updateTooltipPosition)
  }, [showTooltip])

  // Calculate repo card position based on viewport
  useEffect(() => {
    if (!showRepoCard || !commitsRef.current) return

    const updateRepoCardPosition = () => {
      const commitsRect = commitsRef.current?.getBoundingClientRect()

      if (!commitsRect) return

      const viewportHeight = window.innerHeight

      // Check if card would overflow at the bottom
      // Assuming card height is around 400px
      const estimatedCardHeight = 400
      const wouldOverflowBottom = commitsRect.bottom + estimatedCardHeight > viewportHeight

      setRepoCardPosition(wouldOverflowBottom ? "top" : "bottom")
    }

    updateRepoCardPosition()
    window.addEventListener("resize", updateRepoCardPosition)
    return () => window.removeEventListener("resize", updateRepoCardPosition)
  }, [showRepoCard])

  // Split the title into words for staggered animation
  const titleWords = "Build secure authentication without the vendor lock-in.".split(" ")

  // Get formatted commit message
  const commitMessage = latestCommit ? formatCommitMessage(latestCommit.commit.message) : { title: "", description: [] }

  return (
    <motion.div
      className="relative px-6 pt-32"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{ overflow: "visible" }}
    >
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
        className="mt-6 flex items-center gap-2 text-sm relative"
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

        {/* GitHub commits with hover to show repo card */}
        <div className="relative" ref={commitsRef} style={{ overflow: "visible" }}>
          <div
            onMouseEnter={() => setShowRepoCard(true)}
            onMouseLeave={() => setShowRepoCard(false)}
            style={{ overflow: "visible" }}
          >
            <GitHubCommits />
          </div>

          {/* Repo card popover */}
          <AnimatePresence>
            {showRepoCard && (
              <motion.div
                className={`fixed ${repoCardPosition === "top" ? "bottom-full mb-2" : "top-full mt-2"} left-0`}
                style={{
                  zIndex: 9999,
                  position: "absolute",
                }}
                initial={{ opacity: 0, y: repoCardPosition === "top" ? 10 : -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: repoCardPosition === "top" ? 10 : -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Triangle indicator */}
                <div
                  className={`absolute ${
                    repoCardPosition === "top"
                      ? "-bottom-2 border-t border-l rotate-225"
                      : "-top-2 border-t border-l rotate-45"
                  } left-6 h-4 w-4 border-[#1E1E1E] bg-[#0D0C0C]`}
                  style={{ zIndex: 10000 }}
                ></div>
                <GitHubRepoCard />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Latest commit info tagline - updated to handle errors better */}
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
        ) : error ? (
          // If there's an error but we have a fallback commit, still show the commit info
          latestCommit ? (
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
              {/* Note: Using sample data */}
            </>
          ) : (
            <div className="flex items-center">
              <span className="mr-2 font-mono">$</span>
              <span>Unable to fetch commit data</span>
            </div>
          )
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
            </>
          )
        )}

        {/* Git info tooltip - positioned dynamically based on available space */}
        <AnimatePresence>
          {showTooltip && latestCommit && (
            <motion.div
              ref={tooltipRef}
              className={`absolute z-[100] w-80 rounded-md border border-[#1E1E1E] bg-[#0D0C0C]/95 backdrop-blur-sm p-4 shadow-xl ${
                tooltipPosition === "top"
                  ? "bottom-8 left-24"
                  : tooltipPosition === "bottom"
                    ? "top-8 left-24"
                    : tooltipPosition === "left"
                      ? "right-8 top-0"
                      : "left-8 top-0"
              }`}
              initial={{
                opacity: 0,
                y: tooltipPosition === "top" ? 10 : tooltipPosition === "bottom" ? -10 : 0,
                x: tooltipPosition === "left" ? 10 : tooltipPosition === "right" ? -10 : 0,
              }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{
                opacity: 0,
                y: tooltipPosition === "top" ? 10 : tooltipPosition === "bottom" ? -10 : 0,
                x: tooltipPosition === "left" ? 10 : tooltipPosition === "right" ? -10 : 0,
              }}
              transition={{ duration: 0.2 }}
              style={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)" }}
            >
              {/* Arrow pointing in the appropriate direction */}
              <div
                className={`absolute ${
                  tooltipPosition === "top"
                    ? "-bottom-2 left-24 rotate-45 border-r border-b"
                    : tooltipPosition === "bottom"
                      ? "-top-2 left-24 rotate-45 border-t border-l"
                      : tooltipPosition === "left"
                        ? "-right-2 top-4 rotate-45 border-t border-r"
                        : "-left-2 top-4 rotate-45 border-b border-l"
                } h-4 w-4 border-[#1E1E1E] bg-[#0D0C0C]`}
              ></div>

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
        <button className="rounded-md border border-[#1E1E1E] px-4 py-2 text-sm font-medium hover:bg-[#1E1E1E] transition-colors duration-200">
          + Create Sign in Box
        </button>
      </motion.div>
    </motion.div>
  )
}

