"use server"

export interface RepoData {
  name: string
  full_name: string
  description: string | null
  created_at: string
  updated_at: string
  pushed_at: string
  stargazers_count: number
  watchers_count: number
  forks_count: number
  open_issues_count: number
  language: string
  default_branch: string
  topics: string[]
  html_url: string
  languages_url: string
  contributors_url: string
  branches_url: string
  subscribers_count: number
}

export interface LanguageData {
  [key: string]: number
}

export interface ContributorData {
  login: string
  id: number
  avatar_url: string
  contributions: number
}

export interface BranchData {
  name: string
  commit: {
    sha: string
    url: string
  }
}

// Fallback data in case the API fails
const fallbackRepo: RepoData = {
  name: "ROLL-YOUR-OWN-AUTH",
  full_name: "remcostoeten/nextjs-15-roll-your-own-authentication",
  description: "A Next.js 15 authentication implementation from scratch",
  created_at: "2023-11-10T00:00:00Z",
  updated_at: "2024-03-15T00:00:00Z",
  pushed_at: "2024-03-15T00:00:00Z",
  stargazers_count: 3,
  watchers_count: 3,
  forks_count: 0,
  open_issues_count: 0,
  language: "TypeScript",
  default_branch: "master",
  topics: ["nextjs", "authentication", "jwt"],
  html_url: "https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication",
  languages_url: "https://api.github.com/repos/remcostoeten/nextjs-15-roll-your-own-authentication/languages",
  contributors_url: "https://api.github.com/repos/remcostoeten/nextjs-15-roll-your-own-authentication/contributors",
  branches_url: "https://api.github.com/repos/remcostoeten/nextjs-15-roll-your-own-authentication/branches{/branch}",
  subscribers_count: 1,
}

const fallbackLanguages: LanguageData = {
  TypeScript: 72.4,
  Shell: 20.9,
  JavaScript: 6.7,
}

const fallbackContributors: ContributorData[] = [
  {
    login: "remcostoeten",
    id: 12345678,
    avatar_url: "https://avatars.githubusercontent.com/u/12345678?v=4",
    contributions: 20,
  },
]

const fallbackBranches: BranchData[] = [
  {
    name: "master",
    commit: {
      sha: "abcdef1234567890",
      url: "https://api.github.com/repos/remcostoeten/nextjs-15-roll-your-own-authentication/commits/abcdef1234567890",
    },
  },
]

export async function fetchRepoData(repo = "remcostoeten/nextjs-15-roll-your-own-authentication") {
  try {
    // Fetch repository data
    const repoResponse = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}),
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!repoResponse.ok) {
      console.warn(`GitHub API returned ${repoResponse.status}: ${repoResponse.statusText}. Using fallback data.`)
      return {
        repo: fallbackRepo,
        languages: fallbackLanguages,
        contributors: fallbackContributors,
        branches: fallbackBranches,
        source: "fallback",
      }
    }

    const repoData: RepoData = await repoResponse.json()

    // Fetch languages data
    const languagesResponse = await fetch(repoData.languages_url, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}),
      },
      next: { revalidate: 3600 },
    })

    let languagesData: LanguageData = {}
    if (languagesResponse.ok) {
      const rawLanguages = await languagesResponse.json()
      // Calculate percentages
      const total = Object.values(rawLanguages).reduce((sum: number, value: number) => sum + value, 0)
      languagesData = Object.entries(rawLanguages).reduce((acc: LanguageData, [key, value]: [string, number]) => {
        acc[key] = Number.parseFloat(((value / total) * 100).toFixed(1))
        return acc
      }, {})
    } else {
      languagesData = fallbackLanguages
    }

    // Fetch contributors data
    const contributorsResponse = await fetch(repoData.contributors_url, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}),
      },
      next: { revalidate: 3600 },
    })

    let contributorsData: ContributorData[] = []
    if (contributorsResponse.ok) {
      contributorsData = await contributorsResponse.json()
    } else {
      contributorsData = fallbackContributors
    }

    // Fetch branches data
    const branchesUrl = repoData.branches_url.replace("{/branch}", "")
    const branchesResponse = await fetch(branchesUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}),
      },
      next: { revalidate: 3600 },
    })

    let branchesData: BranchData[] = []
    if (branchesResponse.ok) {
      branchesData = await branchesResponse.json()
    } else {
      branchesData = fallbackBranches
    }

    return {
      repo: repoData,
      languages: languagesData,
      contributors: contributorsData,
      branches: branchesData,
      source: "api",
    }
  } catch (error) {
    console.error("Error fetching repo data:", error)
    return {
      repo: fallbackRepo,
      languages: fallbackLanguages,
      contributors: fallbackContributors,
      branches: fallbackBranches,
      source: "fallback",
    }
  }
}

