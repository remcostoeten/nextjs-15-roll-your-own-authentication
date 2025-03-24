"use client"

// Create a new hook for managing changelog votes

import { useState, useEffect, useCallback } from "react"
import { voteChangelogEntry, hasVotedForEntry, getEntryVotes } from "../api/mutations/vote-changelog-entry"

// Mock function to get IP address (in a real app, this would be done server-side)
async function getMockIpAddress(): Promise<string> {
  // In a real app, this would be handled by the server
  // For demo purposes, we'll generate a "fake" IP based on browser fingerprinting
  const userAgent = navigator.userAgent
  const language = navigator.language
  const screenWidth = window.screen.width
  const screenHeight = window.screen.height
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  // Create a simple hash of these values
  const fingerprint = `${userAgent}-${language}-${screenWidth}x${screenHeight}-${timeZone}`
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(fingerprint))
  const hashArray = Array.from(new Uint8Array(hash))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

  // Format as an IP-like string for demonstration
  return `192.168.${hashHex.charCodeAt(0) % 255}.${hashHex.charCodeAt(1) % 255}`
}

// Store voted entries in localStorage to persist across page refreshes
function getVotedEntries(): string[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem("changelog-voted-entries")
    return stored ? JSON.parse(stored) : []
  } catch (e) {
    console.error("Failed to parse voted entries from localStorage", e)
    return []
  }
}

function storeVotedEntry(entryId: string, hasVoted: boolean) {
  if (typeof window === "undefined") return

  try {
    let entries = getVotedEntries()

    if (hasVoted && !entries.includes(entryId)) {
      entries.push(entryId)
    } else if (!hasVoted && entries.includes(entryId)) {
      entries = entries.filter((id) => id !== entryId)
    }

    localStorage.setItem("changelog-voted-entries", JSON.stringify(entries))
  } catch (e) {
    console.error("Failed to store voted entry in localStorage", e)
  }
}

export function useChangelogVotes(entryId: string) {
  const [votes, setVotes] = useState<number>(0)
  const [hasVoted, setHasVoted] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [ipAddress, setIpAddress] = useState<string | null>(null)

  // Get the user's IP address and check if they've voted
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true)

        // Get the user's IP address
        const ip = await getMockIpAddress()
        setIpAddress(ip)

        // Check if the user has voted for this entry
        const voted = await hasVotedForEntry(entryId, ip)
        setHasVoted(voted)

        // Get the total votes for this entry
        const totalVotes = await getEntryVotes(entryId)
        setVotes(totalVotes)

        setError(null)
      } catch (err) {
        console.error("Error initializing votes:", err)
        setError("Failed to load vote data")
      } finally {
        setIsLoading(false)
      }
    }

    initialize()
  }, [entryId])

  // Also check localStorage for client-side persistence
  useEffect(() => {
    const votedEntries = getVotedEntries()
    if (votedEntries.includes(entryId)) {
      setHasVoted(true)
    }
  }, [entryId])

  // Function to toggle vote
  const toggleVote = useCallback(async () => {
    if (!ipAddress) return

    try {
      setIsLoading(true)
      setError(null)

      const userAgent = navigator.userAgent

      const result = await voteChangelogEntry(entryId, ipAddress, userAgent)

      if (result.success) {
        setVotes(result.votes)
        setHasVoted(result.hasVoted)
        storeVotedEntry(entryId, result.hasVoted)
      } else {
        setError(result.message || "Failed to vote")
      }
    } catch (err) {
      console.error("Error voting:", err)
      setError("Failed to vote")
    } finally {
      setIsLoading(false)
    }
  }, [entryId, ipAddress])

  return { votes, hasVoted, isLoading, error, toggleVote }
}

