"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp, Loader2 } from "lucide-react"
import { useChangelogVotes } from "../hooks/use-changelog-votes"

interface VoteButtonProps {
  entryId: string
}

export function VoteButton({ entryId }: VoteButtonProps) {
  const { votes, hasVoted, isLoading, error, toggleVote } = useChangelogVotes(entryId)
  const [showTooltip, setShowTooltip] = useState(false)

  const handleVote = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await toggleVote()
  }

  return (
    <div className="relative">
      <button
        onClick={handleVote}
        disabled={isLoading}
        className={`flex items-center gap-1 rounded-full p-1.5 transition-colors ${
          hasVoted ? "bg-[#4e9815]/20 text-[#4e9815]" : "text-[#8C877D] hover:bg-[#1E1E1E] hover:text-[#F2F0ED]"
        }`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label={hasVoted ? "Remove vote" : "Vote for this feature"}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowUp className={`h-4 w-4 ${hasVoted ? "fill-[#4e9815]" : ""}`} />
        )}
        <span className="text-xs">{votes}</span>
      </button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 rounded bg-[#1E1E1E] px-2 py-1 text-xs text-[#F2F0ED] shadow-lg z-10"
          >
            {error ? (
              <span className="text-red-400">{error}</span>
            ) : hasVoted ? (
              "Click to remove your vote"
            ) : (
              "Vote for this feature"
            )}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1E1E1E]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

