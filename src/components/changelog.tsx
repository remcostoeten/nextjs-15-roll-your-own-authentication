'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import type {
	GitHubCommit,
	VercelDeployment
} from '@/features/analytics/components/actions/changelog'
import {
	getGithubCommits,
	getVercelDeployments
} from '@/features/analytics/components/actions/changelog'
import { cn } from '@/shared/_docs/code-block/cn'
import { format, parseISO } from 'date-fns'
import { AnimatePresence, motion } from 'framer-motion'
import {
	ChevronRight,
	Code2,
	FileCode2,
	GitBranch,
	GitCommit,
	GitMerge,
	Rocket
} from 'lucide-react'
import { useEffect, useState } from 'react'

type ChangelogProps = {
    className?: string
}

type CommitType =
    | 'feature'
    | 'fix'
    | 'chore'
    | 'docs'
    | 'refactor'
    | 'style'
    | 'test'

type MergeInfo = {
    fromBranch: string
    intoBranch: string
}

type FileFilter = {
    search: string
    status: string[]
}

type DiffViewProps = {
    filename: string
    additions: number
    deletions: number
    patch?: string
    status: string
    branch: string
    commitSha: string
}

function DiffView({
    filename,
    additions,
    deletions,
    patch,
    status,
    branch,
    commitSha
}: DiffViewProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FileCode2 className="w-5 h-5 text-gray-400" />
                    <span className="font-mono text-sm">{filename}</span>
                </div>
                <div className="flex items-center gap-4">
                    {/* Branch badge */}
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 border border-white/10">
                        <GitBranch className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400">{branch}</span>
                    </div>
                    {/* Commit SHA */}
                    <span className="text-xs text-gray-500 font-mono">
                        {commitSha.substring(0, 7)}
                    </span>
                </div>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg">
                <pre className="text-sm text-gray-300">{patch}</pre>
            </div>
        </div>
    )
}

function groupCommitsByDate(commits: GitHubCommit[]): { [date: string]: GitHubCommit[] } {
    return commits.reduce((groups, commit) => {
        const date = format(
            new Date(commit.commit.author?.date || ''),
            'yyyy-MM-dd'
        )
        if (!groups[date]) {
            groups[date] = []
        }
        groups[date].push(commit)
        return groups
    }, {} as { [date: string]: GitHubCommit[] })
}

function ChangelogSkeleton() {
    return (
        <div className="space-y-8">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <div className="h-8 w-32 bg-white/5 rounded-lg animate-pulse" />
                <div className="h-10 w-64 bg-white/5 rounded-lg animate-pulse" />
            </div>

            {/* Navigation Tabs Skeleton */}
            <div className="flex items-center gap-4">
                <div className="h-10 w-24 bg-white/5 rounded-lg animate-pulse" />
                <div className="h-10 w-24 bg-white/5 rounded-lg animate-pulse" />
            </div>

            {/* Timeline Skeleton */}
            <div className="space-y-8">
                {/* Repeat for each "day" */}
                {[1, 2].map((day) => (
                    <div key={day} className="space-y-4">
                        {/* Date Separator */}
                        <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-white/10" />
                            <div className="h-5 w-40 bg-white/5 rounded animate-pulse" />
                            <div className="h-px flex-1 bg-white/10" />
                        </div>

                        {/* Commits for the day */}
                        <div className="space-y-4">
                            {/* Repeat for each "commit" */}
                            {[1, 2, 3].map((commit) => (
                                <div 
                                    key={commit}
                                    className="relative pl-6 border-l border-white/10 last:border-l-transparent"
                                >
                                    {/* Timeline dot */}
                                    <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-white/20 border-2 border-white/40" />
                                    
                                    <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 p-4 overflow-hidden relative">
                                        {/* Shimmer effect */}
                                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
                                        
                                        <div className="space-y-4">
                                            {/* Commit Header */}
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-white/10 animate-pulse" />
                                                <div className="h-5 w-2/3 bg-white/10 rounded animate-pulse" />
                                            </div>
                                            
                                            {/* Quick Info Row */}
                                            <div className="flex items-center gap-6">
                                                {/* Branch */}
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded bg-white/10 animate-pulse" />
                                                    <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
                                                </div>
                                                
                                                {/* Changes */}
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded bg-white/10 animate-pulse" />
                                                    <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
                                                </div>
                                                
                                                {/* Files */}
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded bg-white/10 animate-pulse" />
                                                    <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
                                                </div>
                                            </div>
                                            
                                            {/* Author Info */}
                                            <div className="flex justify-end items-center gap-4">
                                                <div className="space-y-1 text-right">
                                                    <div className="h-4 w-24 bg-white/10 rounded animate-pulse ml-auto" />
                                                    <div className="h-3 w-16 bg-white/10 rounded animate-pulse ml-auto" />
                                                </div>
                                                <div className="w-5 h-5 rounded bg-white/10 animate-pulse" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const shimmerKeyframes = `
@keyframes shimmer {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(100%);
    }
}
`

function Changelog({ className }: ChangelogProps) {
    const [activeSection, setActiveSection] = useState<'deployments' | 'changes'>('changes')
    const [commits, setCommits] = useState<GitHubCommit[]>([])
    const [deployments, setDeployments] = useState<VercelDeployment[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [expandedCommits, setExpandedCommits] = useState<Set<string>>(new Set())
    const [stats, setStats] = useState({
        totalCommits: 0,
        frequency: {} as { [key: string]: number },
        languages: {} as { [key: string]: number }
    })
    const [selectedFile, setSelectedFile] = useState<{
        filename: string
        additions: number
        deletions: number
        patch?: string
        status: string
    } | null>(null)
    const [fileFilter, setFileFilter] = useState<FileFilter>({
        search: '',
        status: []
    })

    const toggleCommitExpansion = (commitSha: string) => {
        setExpandedCommits((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(commitSha)) {
                newSet.delete(commitSha)
            } else {
                newSet.add(commitSha)
            }
            return newSet
        })
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                let commitsData: GitHubCommit[] = []
                let deploymentsData: VercelDeployment[] = []
                try {
                    commitsData = await getGithubCommits()
                } catch (error) {
                    console.error('Error fetching commits:', error)
                }
                try {
                    deploymentsData = await getVercelDeployments()
                } catch (error) {
                    console.error('Error fetching deployments:', error)
                }
                setCommits(commitsData)
                setDeployments(deploymentsData)
            } catch (error) {
                console.error('Error fetching changelog data:', error)
                setError(
                    'Failed to fetch changelog data. Please try again later.'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) {
        return <ChangelogSkeleton />
    }

    return (
        <div className={cn('space-y-8', className)}>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Changelog</h1>
                <Input
                    placeholder="Search commits..."
                    value={fileFilter.search}
                    onChange={(e) =>
                        setFileFilter((prev) => ({
                            ...prev,
                            search: e.target.value
                        }))
                    }
                    className="bg-black/20 border-white/10 text-white placeholder:text-neutral-500"
                />
            </div>
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <button
                        className={cn(
                            'px-4 py-2 rounded-lg transition-colors',
                            activeSection === 'changes'
                                ? 'bg-white/10 text-white border border-white/20'
                                : 'text-neutral-400 hover:text-white hover:bg-white/5'
                        )}
                        onClick={() => setActiveSection('changes')}
                    >
                        Changes
                    </button>
                    <button
                        className={cn(
                            'px-4 py-2 rounded-lg transition-colors',
                            activeSection === 'deployments'
                                ? 'bg-white/10 text-white border border-white/20'
                                : 'text-neutral-400 hover:text-white hover:bg-white/5'
                        )}
                        onClick={() => setActiveSection('deployments')}
                    >
                        Deployments
                    </button>
                </div>
                {loading ? (
                    <div className="text-neutral-400">Loading...</div>
                ) : error ? (
                    <div className="text-red-400">{error}</div>
                ) : activeSection === 'changes' ? (
                    <div className="space-y-8">
                        {Object.entries(groupCommitsByDate(commits)).map(([date, dateCommits]) => (
                            <div key={date}>
                                {/* Date Separator */}
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-px flex-1 bg-white/10" />
                                    <time className="text-sm font-medium text-neutral-400">
                                        {format(parseISO(date), 'MMMM d, yyyy')}
                                    </time>
                                    <div className="h-px flex-1 bg-white/10" />
                                </div>

                                <div className="space-y-4">
                                    {dateCommits.map((commit) => (
                                        <div 
                                            key={commit.sha} 
                                            className="relative pl-6 border-l border-white/10 last:border-l-transparent"
                                        >
                                            {/* Timeline dot */}
                                            <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-white/20 border-2 border-white/40" />
                                            
                                            <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200">
                                                <div
                                                    className="flex items-center justify-between cursor-pointer p-4"
                                                    onClick={() => toggleCommitExpansion(commit.sha)}
                                                >
                                                    <div className="space-y-1 flex-1 min-w-0">
                                                        {/* Commit message and type */}
                                                        <div className="flex items-center gap-2">
                                                            <GitCommit className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                                                            <span className="font-medium text-white truncate">
                                                                {commit.commit.message}
                                                            </span>
                                                        </div>
                                                        
                                                        {/* Quick info row */}
                                                        <div className="flex items-center gap-4 text-sm text-neutral-400">
                                                            {/* Branch info */}
                                                            <div className="flex items-center gap-1">
                                                                <GitBranch className="w-4 h-4" />
                                                                {commit.merge ? (
                                                                    <div className="flex items-center gap-1">
                                                                        <span className="text-purple-400">{commit.merge.fromBranch}</span>
                                                                        <GitMerge className="w-3 h-3" />
                                                                        <span>{commit.merge.intoBranch}</span>
                                                                    </div>
                                                                ) : (
                                                                    <span>main</span>
                                                                )}
                                                            </div>
                                                            
                                                            {/* Changes summary */}
                                                            <div className="flex items-center gap-1">
                                                                <Code2 className="w-4 h-4" />
                                                                <span className="text-green-400">+{commit.stats.additions}</span>
                                                                <span className="text-red-400">-{commit.stats.deletions}</span>
                                                            </div>
                                                            
                                                            {/* Files changed */}
                                                            <div className="flex items-center gap-1">
                                                                <FileCode2 className="w-4 h-4" />
                                                                <span>{commit.files?.length || 0} files</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4 flex-shrink-0">
                                                        {/* Author and time */}
                                                        <div className="text-right">
                                                            <div className="text-sm text-neutral-300">
                                                                {commit.commit.author?.name}
                                                            </div>
                                                            <time className="text-xs text-neutral-500">
                                                                {format(new Date(commit.commit.author?.date || ''), 'HH:mm')}
                                                            </time>
                                                        </div>
                                                        
                                                        <motion.div
                                                            initial={{ rotate: 0 }}
                                                            animate={{ rotate: expandedCommits.has(commit.sha) ? 90 : 0 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <ChevronRight className="w-5 h-5 text-neutral-400" />
                                                        </motion.div>
                                                    </div>
                                                </div>

                                                {/* Expanded content remains the same */}
                                                <AnimatePresence>
                                                    {expandedCommits.has(commit.sha) && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="overflow-hidden border-t border-white/10"
                                                        >
                                                            {/* Existing expanded content... */}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                    >
                        {deployments.map((deployment) => (
                            <motion.div
                                key={deployment.uid}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Rocket className="w-5 h-5 text-blue-500" />
                                        <span className="font-mono text-lg">{deployment.name}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-gray-500 font-mono">
                                            {format(new Date(deployment.created), 'PPpp')}
                                        </span>
                                        <span className={cn(
                                            'px-2 py-1 rounded-full text-xs',
                                            deployment.state === 'ready' 
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        )}>
                                            {deployment.state}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* File Diff Dialog */}
            <Dialog
                open={!!selectedFile}
                onOpenChange={(open) => !open && setSelectedFile(null)}
            >
                <DialogContent>
                    {selectedFile && (
                        <DiffView
                            filename={selectedFile.filename}
                            additions={selectedFile.additions}
                            deletions={selectedFile.deletions}
                            patch={selectedFile.patch}
                            status={selectedFile.status}
                            branch="main"
                            commitSha="abc123"
                        />
                    )}
                </DialogContent>

            </Dialog>
        </div>
    )
}

export default Changelog
