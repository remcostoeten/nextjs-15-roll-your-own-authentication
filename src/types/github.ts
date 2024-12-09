export type GitHubActivity = {
    type: 'commit' | 'branch' | 'merge'
    id: string
    timestamp: string
    author: {
        name: string
        avatar: string
    }
    data: {
        message?: string
        branchName?: string
        mergeTitle?: string
        files?: {
            name: string
            changes: number
            additions: number
            deletions: number
            url: string
        }[]
    }
} 