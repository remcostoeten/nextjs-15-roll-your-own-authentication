"use client"

import { useState, useEffect } from "react"
import type { CommitData } from "../api/queries/fetch-latest-commit"

interface UseGithubCommitProps {
  initialCommit?: CommitData | null
}

// Define a fallback commit in case the API fails
const fallbackCommit: CommitData = {
  sha: "fallback-sha",
  html_url: "#",
  commit: {
    message: "Fallback commit message",
    author: {
      name: "Fallback Author",
      email: "fallback@example.com",
      date: new Date().toISOString(),
    },
  },
  author: null,
}

export function useGithubCommit({ initialCommit = null }: UseGithubCommitProps = {}) {
  const [commit, setCommit] = useState<CommitData | null>(initialCommit)
  const [isLoading, setIsLoading] = useState(!initialCommit)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If we already have the commit data (from SSR), don't fetch again
    if (initialCommit) {
      return
    }

    async function loadCommit() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/github/latest-commit")

        if (!response.ok) {
          throw new Error(`Failed to fetch commit: ${response.status}`)
        }

        const data = await response.json()

        // If we got an error but also a fallback commit, use the fallback
        if (data.error && data.commit) {
          setCommit(data.commit)
          setError(data.error)
        } else if (data.commit) {
          setCommit(data.commit)
          setError(null)
        } else {
          throw new Error("Invalid response format")
        }
      } catch (err) {
        console.error("Error loading commit:", err)
        setError(err instanceof Error ? err.message : "Failed to load commit data")
        // Don't clear the commit if we already have one (e.g., from SSR)
        if (!commit) {
          // Try to use a fallback commit
          setCommit(fallbackCommit)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadCommit()
  }, [initialCommit, commit])

  return { commit, isLoading, error }
}

