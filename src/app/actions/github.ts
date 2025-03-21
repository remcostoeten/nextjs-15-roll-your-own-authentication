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

export async function fetchLatestCommits(repo: string, branch = "main", count = 5) {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN is required but not configured')
  }

  try {
    console.log(`Fetching commits for ${repo} on branch ${branch}...`)

    const response = await fetch(`https://api.github.com/repos/${repo}/commits?sha=${branch}&per_page=${count}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} - ${response.statusText}`)
    }

    const commits: GitHubCommit[] = await response.json()

    if (!commits || !Array.isArray(commits) || commits.length === 0) {
      throw new Error('No commits found')
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
    throw error instanceof Error ? error : new Error('Failed to fetch commits')
  }
}

