import { type NextRequest, NextResponse } from "next/server"
import {
  getAllChangelogVotes,
  getChangelogEntryVotes,
  getTopVotedChangelogEntries,
  getChangelogEntryVoterData,
} from "@/modules/changelog/api/queries/get-changelog-votes"
import { voteChangelogEntry } from "@/modules/changelog/api/mutations/vote-changelog-entry"

// Helper to get the client IP address
function getClientIp(req: NextRequest): string {
  // In a real app, you would use headers like x-forwarded-for
  const forwardedFor = req.headers.get("x-forwarded-for")
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim()
  }

  // Fallback to Vercel-specific headers
  const vercelIp = req.headers.get("x-real-ip")
  if (vercelIp) {
    return vercelIp
  }

  // Generate a mock IP if none is provided
  return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
}

// Helper to check if the request is from an admin
// In a real app, this would check authentication and authorization
function isAdmin(req: NextRequest): boolean {
  // For demo purposes, we'll use a special header
  // In a real app, you would use a proper auth system
  return req.headers.get("x-admin-auth") === "true"
}

// GET handler for fetching votes
export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const entryId = url.searchParams.get("entryId")
  const top = url.searchParams.get("top")
  const admin = isAdmin(req)

  try {
    // Get votes for a specific entry
    if (entryId) {
      // If admin parameter is provided and user is admin, return voter data
      if (url.searchParams.get("admin") === "true" && admin) {
        const voterData = await getChangelogEntryVoterData(entryId, true)
        return NextResponse.json({ voterData })
      }

      // Otherwise just return the vote count
      const votes = await getChangelogEntryVotes(entryId)
      return NextResponse.json({ votes })
    }

    // Get top voted entries
    if (top) {
      const limit = Number.parseInt(top, 10) || 5
      const topEntries = await getTopVotedChangelogEntries(limit)
      return NextResponse.json({ topEntries })
    }

    // Get all votes
    const allVotes = await getAllChangelogVotes()
    return NextResponse.json({ votes: allVotes })
  } catch (error) {
    console.error("Error fetching votes:", error)
    return NextResponse.json({ error: "Failed to fetch votes" }, { status: 500 })
  }
}

// POST handler for voting
export async function POST(req: NextRequest) {
  try {
    const { entryId } = await req.json()

    if (!entryId) {
      return NextResponse.json({ error: "Entry ID is required" }, { status: 400 })
    }

    const ip = getClientIp(req)
    const userAgent = req.headers.get("user-agent") || undefined

    const result = await voteChangelogEntry(entryId, ip, userAgent)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error processing vote:", error)
    return NextResponse.json({ error: "Failed to process vote" }, { status: 500 })
  }
}

