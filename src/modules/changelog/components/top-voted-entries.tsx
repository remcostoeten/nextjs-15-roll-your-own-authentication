"use client"

import { useState, useEffect } from "react"
import { getTopVotedChangelogEntries } from "../api/queries/get-changelog-votes"
import { ArrowUp, Loader2 } from "lucide-react"
import Link from "next/link"

interface TopVotedEntriesProps {
  limit?: number
}

export function TopVotedEntries({ limit = 5 }: TopVotedEntriesProps) {
  const [topEntries, setTopEntries] = useState<Array<{ id: string; title: string; votes: number }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTopEntries = async () => {
      try {
        setIsLoading(true)
        const entries = await getTopVotedChangelogEntries(limit)
        setTopEntries(entries)
        setError(null)
      } catch (err) {
        console.error("Error fetching top voted entries:", err)
        setError("Failed to load top voted entries")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTopEntries()
  }, [limit])

  return (
    <div className="border border-[#1E1E1E] rounded-lg bg-[#0D0C0C]/50 p-4">
      <h3 className="text-lg font-medium text-[#F2F0ED] mb-4">Top Voted Features</h3>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-[#4e9815]" />
        </div>
      ) : error ? (
        <div className="text-red-400 text-sm py-4">{error}</div>
      ) : topEntries.length > 0 ? (
        <ul className="space-y-3">
          {topEntries.map((entry) => (
            <li key={entry.id} className="border-b border-[#1E1E1E] pb-3 last:border-0">
              <Link href={`/changelog#${entry.id}`} className="flex items-center justify-between group">
                <span className="text-[#8C877D] group-hover:text-[#F2F0ED] transition-colors">{entry.title}</span>
                <span className="flex items-center gap-1 text-xs text-[#4e9815]">
                  <ArrowUp className="h-3 w-3" />
                  {entry.votes}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-[#8C877D] text-sm py-4">No voted entries yet</div>
      )}

      <div className="mt-4 text-center">
        <Link href="/changelog" className="text-xs text-[#4e9815] hover:underline">
          View all changelog entries
        </Link>
      </div>
    </div>
  )
}

