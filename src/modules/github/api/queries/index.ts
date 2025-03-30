'use server'

import { z } from 'zod'
import { githubFetch, createGithubCache } from '../../utils/github-fetch'
import { 
    githubRepoSchema,
    githubCommitSchema,
    githubLanguagesSchema,
    githubContributorSchema,
    githubBranchSchema,
    type GithubRepo,
    type GithubCommit,
    type GithubLanguages,
    type GithubContributor,
    type GithubBranch,
    type QueryResponse
} from '../../types/github'

// Fallback data
const fallbackRepo: GithubRepo = {
    name: 'ROLL-YOUR-OWN-AUTH',
    full_name: 'remcostoeten/nextjs-15-roll-your-own-authentication',
    description: 'A Next.js 15 authentication implementation from scratch',
    created_at: '2023-11-10T00:00:00Z',
    updated_at: '2024-03-15T00:00:00Z',
    stargazers_count: 3,
    forks_count: 0,
    default_branch: 'master',
    html_url: 'https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication',
    languages_url: 'https://api.github.com/repos/remcostoeten/nextjs-15-roll-your-own-authentication/languages',
    contributors_url: 'https://api.github.com/repos/remcostoeten/nextjs-15-roll-your-own-authentication/contributors',
    branches_url: 'https://api.github.com/repos/remcostoeten/nextjs-15-roll-your-own-authentication/branches{/branch}',
    subscribers_count: 1
}

const fallbackCommits: GithubCommit[] = [
    {
        sha: 'abc123',
        commit: {
            message: 'Implement custom JWT authentication',
            author: {
                name: 'Remco Stoeten',
                email: 'remco@example.com',
                date: '2024-03-15T10:00:00Z'
            }
        },
        author: {
            login: 'remcostoeten',
            avatar_url: 'https://github.com/remcostoeten.png'
        },
        html_url: 'https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication/commit/abc123'
    },
    {
        sha: 'def456',
        commit: {
            message: 'Add session management and rate limiting',
            author: {
                name: 'Remco Stoeten',
                email: 'remco@example.com',
                date: '2024-03-14T15:30:00Z'
            }
        },
        author: {
            login: 'remcostoeten',
            avatar_url: 'https://github.com/remcostoeten.png'
        },
        html_url: 'https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication/commit/def456'
    },
    {
        sha: 'ghi789',
        commit: {
            message: 'Implement user registration and login flows',
            author: {
                name: 'Remco Stoeten',
                email: 'remco@example.com',
                date: '2024-03-13T09:45:00Z'
            }
        },
        author: {
            login: 'remcostoeten',
            avatar_url: 'https://github.com/remcostoeten.png'
        },
        html_url: 'https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication/commit/ghi789'
    },
    {
        sha: 'jkl012',
        commit: {
            message: 'Set up database schema and migrations',
            author: {
                name: 'Remco Stoeten',
                email: 'remco@example.com',
                date: '2024-03-12T14:20:00Z'
            }
        },
        author: {
            login: 'remcostoeten',
            avatar_url: 'https://github.com/remcostoeten.png'
        },
        html_url: 'https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication/commit/jkl012'
    },
    {
        sha: 'mno345',
        commit: {
            message: 'Initial project setup with Next.js 15',
            author: {
                name: 'Remco Stoeten',
                email: 'remco@example.com',
                date: '2024-03-11T11:00:00Z'
            }
        },
        author: {
            login: 'remcostoeten',
            avatar_url: 'https://github.com/remcostoeten.png'
        },
        html_url: 'https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication/commit/mno345'
    }
]

// Repository info query
export async function getRepoInfo(owner: string, repo: string): Promise<QueryResponse<GithubRepo>> {
    try {
        const { data, error } = await githubFetch<GithubRepo>(`/repos/${owner}/${repo}`, {
            schema: githubRepoSchema,
            tags: [`repo-${owner}-${repo}`]
        })

        if (error || !data) {
            return {
                data: fallbackRepo,
                error,
                source: 'fallback'
            }
        }

        return {
            data,
            error: null,
            source: 'api'
        }
    } catch (error) {
        console.error('Error fetching repo info:', error)
        return {
            data: fallbackRepo,
            error: error instanceof Error ? error.message : 'Unknown error',
            source: 'fallback'
        }
    }
}

// Latest commits query
export async function getLatestCommits(
    owner: string, 
    repo: string, 
    count: number = 5
): Promise<QueryResponse<GithubCommit[]>> {
    try {
        const { data, error } = await githubFetch<GithubCommit[]>(
            `/repos/${owner}/${repo}/commits?per_page=${count}`,
            { 
                schema: z.array(githubCommitSchema),
                tags: [`commits-${owner}-${repo}`]
            }
        )

        if (error || !data) {
            return {
                data: fallbackCommits.slice(0, count),
                error,
                source: 'fallback'
            }
        }

        return {
            data,
            error: null,
            source: 'api'
        }
    } catch (error) {
        console.error('Error fetching commits:', error)
        return {
            data: fallbackCommits.slice(0, count),
            error: error instanceof Error ? error.message : 'Unknown error',
            source: 'fallback'
        }
    }
}

// Languages query
export async function getRepoLanguages(
    owner: string, 
    repo: string
): Promise<QueryResponse<GithubLanguages>> {
    try {
        const { data, error } = await githubFetch<Record<string, number>>(
            `/repos/${owner}/${repo}/languages`,
            { 
                schema: githubLanguagesSchema,
                tags: [`languages-${owner}-${repo}`]
            }
        )

        if (error || !data) {
            return {
                data: { TypeScript: 70, JavaScript: 20, Shell: 10 },
                error,
                source: 'fallback'
            }
        }

        // Convert byte counts to percentages
        const total = Object.values(data).reduce((a, b) => a + b, 0)
        const percentages = Object.entries(data).reduce<Record<string, number>>((acc, [lang, count]) => ({
            ...acc,
            [lang]: Math.round((count / total) * 100)
        }), {})

        return {
            data: percentages,
            error: null,
            source: 'api'
        }
    } catch (error) {
        console.error('Error fetching languages:', error)
        return {
            data: { TypeScript: 70, JavaScript: 20, Shell: 10 },
            error: error instanceof Error ? error.message : 'Unknown error',
            source: 'fallback'
        }
    }
}

// Contributors query
export async function getRepoContributors(
    owner: string, 
    repo: string
): Promise<QueryResponse<GithubContributor[]>> {
    try {
        const { data, error } = await githubFetch<GithubContributor[]>(
            `/repos/${owner}/${repo}/contributors`,
            { 
                schema: z.array(githubContributorSchema),
                tags: [`contributors-${owner}-${repo}`]
            }
        )

        if (error || !data) {
            return {
                data: [{
                    login: owner,
                    id: 0,
                    avatar_url: `https://github.com/${owner}.png`,
                    contributions: 100
                }],
                error,
                source: 'fallback'
            }
        }

        return {
            data,
            error: null,
            source: 'api'
        }
    } catch (error) {
        console.error('Error fetching contributors:', error)
        return {
            data: [{
                login: owner,
                id: 0,
                avatar_url: `https://github.com/${owner}.png`,
                contributions: 100
            }],
            error: error instanceof Error ? error.message : 'Unknown error',
            source: 'fallback'
        }
    }
}

// Branches query
export async function getRepoBranches(
    owner: string, 
    repo: string
): Promise<QueryResponse<GithubBranch[]>> {
    try {
        const { data, error } = await githubFetch<GithubBranch[]>(
            `/repos/${owner}/${repo}/branches`,
            { 
                schema: z.array(githubBranchSchema),
                tags: [`branches-${owner}-${repo}`]
            }
        )

        if (error || !data) {
            return {
                data: [{
                    name: 'master',
                    commit: {
                        sha: 'fallback-sha',
                        url: `https://github.com/${owner}/${repo}/commit/fallback-sha`
                    }
                }],
                error,
                source: 'fallback'
            }
        }

        return {
            data,
            error: null,
            source: 'api'
        }
    } catch (error) {
        console.error('Error fetching branches:', error)
        return {
            data: [{
                name: 'master',
                commit: {
                    sha: 'fallback-sha',
                    url: `https://github.com/${owner}/${repo}/commit/fallback-sha`
                }
            }],
            error: error instanceof Error ? error.message : 'Unknown error',
            source: 'fallback'
        }
    }
} 