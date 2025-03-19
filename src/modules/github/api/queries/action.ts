"use server"

interface GitHubCommit {
    sha: string
    commit: {
        message: string
        author: {
            name: string
            date: string
        }
    }
    html_url: string
    author: {
        login: string
        avatar_url: string
    }
}

// Fallback commits in case the API fails
const fallbackCommits = [
    {
        sha: "abcd1234",
        message: "Implement JWT authentication",
        author: "remcostoeten",
        authorAvatar: "",
        date: "2023-11-15T10:30:00Z",
        url: "https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication/commit/abcd1234",
    },
    {
        sha: "efgh5678",
        message: "Add password hashing utility",
        author: "remcostoeten",
        authorAvatar: "",
        date: "2023-11-14T14:20:00Z",
        url: "https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication/commit/efgh5678",
    },
    {
        sha: "ijkl9012",
        message: "Create user registration flow",
        author: "remcostoeten",
        authorAvatar: "",
        date: "2023-11-13T09:15:00Z",
        url: "https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication/commit/ijkl9012",
    },
    {
        sha: "mnop3456",
        message: "Set up database schema",
        author: "remcostoeten",
        authorAvatar: "",
        date: "2023-11-12T16:45:00Z",
        url: "https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication/commit/mnop3456",
    },
    {
        sha: "qrst7890",
        message: "Initial commit",
        author: "remcostoeten",
        authorAvatar: "",
        date: "2023-11-10T11:00:00Z",
        url: "https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication/commit/qrst7890",
    },
]

export async function fetchLatestCommits(repo: string, branch = "master", count = 5) {
    try {
        console.log(`Fetching commits for ${repo} on branch ${branch}...`)

        const response = await fetch(`https://api.github.com/repos/${repo}/commits?sha=${branch}&per_page=${count}`, {
            headers: {
                Accept: "application/vnd.github.v3+json",
                // Use GitHub token if available for higher rate limits
                ...(process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}),
            },
            next: { revalidate: 3600 }, // Cache for 1 hour
        })

        if (!response.ok) {
            console.error(`GitHub API error: ${response.status} - ${response.statusText}`)

            // If we hit rate limits or other API issues, use fallback data
            return {
                success: true,
                commits: fallbackCommits,
                source: "fallback",
                error: `GitHub API error: ${response.status} - ${response.statusText}`,
            }
        }

        const commits: GitHubCommit[] = await response.json()

        if (!commits || !Array.isArray(commits) || commits.length === 0) {
            console.warn("No commits returned from GitHub API, using fallback data")
            return {
                success: true,
                commits: fallbackCommits,
                source: "fallback",
                error: "No commits returned from GitHub API",
            }
        }

        return {
            success: true,
            commits: commits.map((commit) => ({
                sha: commit.sha,
                message: commit.commit.message,
                author: commit.author?.login || commit.commit.author.name,
                authorAvatar: commit.author?.avatar_url || "",
                date: commit.commit.author.date,
                url: commit.html_url,
            })),
            source: "api",
        }
    } catch (error) {
        console.error("Error fetching commits:", error)

        // Return fallback data on any error
        return {
            success: true,
            commits: fallbackCommits,
            source: "fallback",
            error: error instanceof Error ? error.message : "Unknown error",
        }
    }
}

