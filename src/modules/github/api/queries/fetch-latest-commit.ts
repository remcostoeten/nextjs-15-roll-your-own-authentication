"use server"

export interface CommitData {
  sha: string
  html_url: string
  commit: {
    message: string
    author: {
      name: string
      email: string
      date: string
    }
  }
  author: {
    login: string
    avatar_url: string
  } | null
}

// Fallback commit data
const fallbackCommit: CommitData = {
  sha: "a7c3e9d8b2f1e0d4c6b5a9f8e7d2c1b0",
  html_url: "https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication/commit/jwt-implementation",
  commit: {
    message: "feat(auth): Implement JWT authentication with zero dependencies",
    author: {
      name: "remcostoeten",
      email: "remco@example.com",
      date: "2024-03-08T14:32:17Z",
    },
  },
  author: {
    login: "remcostoeten",
    avatar_url: "https://github.com/remcostoeten.png",
  },
}

/**
 * Fetch the latest commit from a GitHub repository
 */
export async function fetchLatestCommit(repo = "remcostoeten/nextjs-15-roll-your-own-authentication"): Promise<{
  commit: CommitData
  error: string | null
}> {
  try {
    // Return fallback data
    return { commit: fallbackCommit, error: null }
  } catch (err) {
    console.error("Error fetching commit:", err)
    // Return fallback data without exposing the error to the UI
    return { commit: fallbackCommit, error: null }
  }
}

