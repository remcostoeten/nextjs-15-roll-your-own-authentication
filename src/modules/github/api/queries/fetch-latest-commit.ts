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

// Fallback commit data in case of API failure
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
        const response = await fetch(`https://api.github.com/repos/${repo}/commits?per_page=1`, {
            headers: {
                Accept: "application/vnd.github.v3+json",
                // Use GitHub token if available
                ...(process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}),
            },
            next: { revalidate: 3600 }, // Cache for 1 hour
        })

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`)
        }

        const commits = await response.json()
        if (!commits || !Array.isArray(commits) || commits.length === 0) {
            throw new Error("No commits found")
        }

        return { commit: commits[0], error: null }
    } catch (err) {
        console.error("Error fetching commit:", err)
        return {
            commit: fallbackCommit,
            error: err instanceof Error ? err.message : "Failed to fetch commit data",
        }
    }
}

