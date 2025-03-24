"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { getChangelogEntryVoterData } from "../api/queries/get-changelog-votes"
import { Loader2, Globe } from "lucide-react"

interface AdminVoterDataProps {
  entryId: string
  isAdmin: boolean
}

export function AdminVoterData({ entryId, isAdmin }: AdminVoterDataProps) {
  const [voterData, setVoterData] = useState<any[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (!isAdmin || !isExpanded) return

    const fetchVoterData = async () => {
      try {
        setIsLoading(true)
        const data = await getChangelogEntryVoterData(entryId, isAdmin)
        setVoterData(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching voter data:", err)
        setError("Failed to load voter data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchVoterData()
  }, [entryId, isAdmin, isExpanded])

  if (!isAdmin) return null

  return (
    <div className="mt-4 border-t border-[#1E1E1E] pt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-xs text-[#8C877D] hover:text-[#F2F0ED] transition-colors"
      >
        <Globe className="h-3 w-3" />
        {isExpanded ? "Hide voter data" : "Show voter data (Admin only)"}
      </button>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-3"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-[#8C877D]" />
            </div>
          ) : error ? (
            <div className="text-red-400 text-xs py-2">{error}</div>
          ) : voterData && voterData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#1E1E1E]">
                    <th className="text-left py-2 px-2 text-[#8C877D]">IP Address</th>
                    <th className="text-left py-2 px-2 text-[#8C877D]">Location</th>
                    <th className="text-left py-2 px-2 text-[#8C877D]">Time</th>
                    <th className="text-left py-2 px-2 text-[#8C877D]">Device</th>
                  </tr>
                </thead>
                <tbody>
                  {voterData.map((voter, index) => (
                    <tr key={index} className="border-b border-[#1E1E1E]">
                      <td className="py-2 px-2 text-[#F2F0ED]">{voter.ip}</td>
                      <td className="py-2 px-2 text-[#F2F0ED]">
                        {voter.city && voter.country ? `${voter.city}, ${voter.country}` : "Unknown"}
                      </td>
                      <td className="py-2 px-2 text-[#8C877D]">{new Date(voter.timestamp).toLocaleString()}</td>
                      <td className="py-2 px-2 text-[#8C877D] truncate max-w-[200px]" title={voter.userAgent}>
                        {voter.userAgent ? voter.userAgent.split(" ")[0] : "Unknown"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-[#8C877D] text-xs py-2">No voter data available</div>
          )}
        </motion.div>
      )}
    </div>
  )
}

