import { z } from 'zod'

// Zod schemas for validation
export const githubRepoSchema = z.object({
    name: z.string(),
    full_name: z.string(),
    description: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
    stargazers_count: z.number(),
    forks_count: z.number(),
    default_branch: z.string(),
    html_url: z.string(),
    languages_url: z.string(),
    contributors_url: z.string(),
    branches_url: z.string(),
    subscribers_count: z.number().optional(),
})

export const githubCommitSchema = z.object({
    sha: z.string(),
    html_url: z.string(),
    commit: z.object({
        message: z.string(),
        author: z.object({
            name: z.string(),
            email: z.string().optional(),
            date: z.string()
        })
    }),
    author: z.object({
        login: z.string(),
        avatar_url: z.string()
    }).nullable()
})

export const githubLanguagesSchema = z.record(z.number())

export const githubContributorSchema = z.object({
    login: z.string(),
    id: z.number(),
    avatar_url: z.string(),
    contributions: z.number()
})

export const githubBranchSchema = z.object({
    name: z.string(),
    commit: z.object({
        sha: z.string(),
        url: z.string()
    })
})

// Infer types from schemas
export type GithubRepo = z.infer<typeof githubRepoSchema>
export type GithubCommit = z.infer<typeof githubCommitSchema>
export type GithubLanguages = z.infer<typeof githubLanguagesSchema>
export type GithubContributor = z.infer<typeof githubContributorSchema>
export type GithubBranch = z.infer<typeof githubBranchSchema>

// Response types for queries
export type QueryResponse<T> = {
    data: T | null
    error: string | null
    source: 'api' | 'cache' | 'fallback'
} 