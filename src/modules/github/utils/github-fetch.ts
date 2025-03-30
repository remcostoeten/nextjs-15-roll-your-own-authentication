'use server'

import { unstable_cache } from 'next/cache'
import { z } from 'zod'
import { env } from '@/env'

const GITHUB_API_BASE = 'https://api.github.com'
const CACHE_TIME = 60 * 60 // 1 hour in seconds

interface FetchOptions {
    schema?: z.ZodType<any>
    revalidate?: number
    tags?: string[]
}

export async function githubFetch<T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<{ data: T | null; error: string | null }> {
    const { schema, revalidate = CACHE_TIME, tags = [] } = options
    const token = process.env.GITHUB_TOKEN

    try {
        const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                ...(token && { 'Authorization': `token ${token}` })
            },
            next: {
                revalidate,
                tags: ['github', ...tags]
            }
        })

        if (!response.ok) {
            if (response.status === 403) {
                return { 
                    data: null, 
                    error: 'Rate limit exceeded. Please try again later.' 
                }
            }
            if (response.status === 404) {
                return { 
                    data: null, 
                    error: 'Resource not found.' 
                }
            }
            throw new Error(`GitHub API error: ${response.status}`)
        }

        const json = await response.json()

        if (schema) {
            const parsed = schema.safeParse(json)
            if (!parsed.success) {
                console.error('Schema validation error:', parsed.error)
                return { 
                    data: null, 
                    error: 'Invalid data received from GitHub API' 
                }
            }
            return { data: parsed.data as T, error: null }
        }

        return { data: json as T, error: null }
    } catch (error) {
        console.error('GitHub API fetch error:', error)
        return { 
            data: null, 
            error: error instanceof Error ? error.message : 'Unknown error occurred' 
        }
    }
}

export async function createGithubCache<T>(
    key: string,
    fn: () => Promise<{ data: T | null; error: string | null }>,
    tags: string[] = []
) {
    return unstable_cache(
        fn,
        [`github-${key}`, ...tags],
        {
            revalidate: CACHE_TIME,
            tags: ['github', ...tags]
        }
    )
} 