import { NextResponse } from "next/server"
import { fetchLatestCommit } from "@/modules/github/api/queries/fetch-latest-commit"

// Update the API route to handle errors more gracefully
export async function GET() {
  try {
    const { commit, error } = await fetchLatestCommit()

    // Always return the commit, even if there's an error
    // This ensures the UI always has data to display
    return NextResponse.json({ commit, error })
  } catch (error) {
    console.error("Error in GitHub API route:", error)

    // Return a fallback response
    return NextResponse.json({
      commit: {
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
      },
      error: "Failed to fetch commit data",
    })
  }
}

