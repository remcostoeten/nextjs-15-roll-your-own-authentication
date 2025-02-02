'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import {
    AlertTriangle,
    CheckCircle2,
    ChevronDown,
    Clock,
    GitCommit,
    Package,
    Users,
    XCircle,
    File,
    FileCode,
    GitBranch,
    Scale,
    Plus,
    Minus,
    FileSymlink,
    GitMerge,
    GitPullRequest
} from 'lucide-react'
import { useEffect, useState } from 'react'
import NumberFlow from '@number-flow/react'

const LANGUAGE_CONFIG = {
    ts: { label: 'TypeScript', color: 'text-blue-400 bg-blue-400/10' },
    tsx: { label: 'TypeScript', color: 'text-blue-400 bg-blue-400/10' },
    js: { label: 'JavaScript', color: 'text-yellow-400 bg-yellow-400/10' },
    jsx: { label: 'JavaScript', color: 'text-yellow-400 bg-yellow-400/10' },
    css: { label: 'CSS', color: 'text-pink-400 bg-pink-400/10' },
    scss: { label: 'SCSS', color: 'text-pink-400 bg-pink-400/10' },
    html: { label: 'HTML', color: 'text-orange-400 bg-orange-400/10' },
    json: { label: 'JSON', color: 'text-green-400 bg-green-400/10' },
    md: { label: 'Markdown', color: 'text-purple-400 bg-purple-400/10' },
    yml: { label: 'YAML', color: 'text-red-400 bg-red-400/10' },
    yaml: { label: 'YAML', color: 'text-red-400 bg-red-400/10' },
    sh: { label: 'Shell', color: 'text-gray-400 bg-gray-400/10' },
    bash: { label: 'Shell', color: 'text-gray-400 bg-gray-400/10' },
    gitignore: { label: 'Git', color: 'text-orange-400 bg-orange-400/10' },
    prettierrc: { label: 'Prettier', color: 'text-pink-400 bg-pink-400/10' },
    eslintrc: { label: 'ESLint', color: 'text-purple-400 bg-purple-400/10' }
} as const

export default function Changelog() {
    const [activities, setActivities] = useState<Array<any>>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchActivities = async () => {
        try {
            setError(null)
            setLoading(true)
            
            // First fetch the commits list
            const commitsRes = await fetch(
                `https://api.github.com/repos/remcostoeten/nextjs-15-roll-your-own-authentication/commits?page=${page}&per_page=10`
            )

            if (!commitsRes.ok) {
                throw new Error('Failed to fetch repository data')
            }

            const commits = await commitsRes.json()

            // Then fetch detailed data for each commit
            const enrichedCommits = await Promise.all(
                commits.map(async (commit: any) => {
                    const detailRes = await fetch(commit.url)
                    if (!detailRes.ok) {
                        throw new Error('Failed to fetch commit details')
                    }
                    const detail = await detailRes.json()
                    
                    const commitInfo = getCommitTypeAndDetails(detail)
                    
                    return {
                        ...commit,
                        ...detail,
                        type: commitInfo.type,
                        fromBranch: commitInfo.type === 'merge' ? commitInfo.from : undefined,
                        intoBranch: commitInfo.type === 'merge' ? commitInfo.into : undefined,
                        branch: commitInfo.type === 'commit' ? commitInfo.branch : undefined,
                        isPullRequest: commitInfo.type === 'merge' ? commitInfo.isPR : false,
                        status: commit.commit.verification?.verified ? 'verified' : 'unverified',
                        environment: commit.commit.message.toLowerCase().includes('production') ? 'production' : 'development',
                        impact: detail.stats?.total > 100 ? 'major' : 'minor',
                        stats: {
                            additions: detail.stats?.additions || 0,
                            deletions: detail.stats?.deletions || 0,
                            total: detail.stats?.total || 0
                        }
                    }
                })
            )

            setActivities(prev => [...prev, ...enrichedCommits])
            setHasMore(commits.length === 10)
        } catch (error) {
            console.error('Error fetching activities:', error)
            setError('Failed to load repository data. Please try again later.')
            setHasMore(false)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchActivities()
    }, [page])

    const getCommitTypeAndDetails = (commit: any) => {
        if (commit.parents?.length > 1) {
            const mergeMessage = commit.commit.message
            const mergeRegex = /Merge (branch|pull request) '?([^']+)'? (into|from) '?([^']+)'?/i
            const match = mergeMessage.match(mergeRegex)
            
            if (match) {
                return {
                    type: 'merge',
                    from: match[2],
                    into: match[4],
                    isPR: match[1].toLowerCase().includes('pull request')
                }
            }
        }

        return {
            type: 'commit',
            branch: commit.commit.message.match(/\[(.*?)\]/)?.[1] || 'main'
        }
    }

    const getStatusBadge = (status: string, commitType: string, fromBranch?: string, intoBranch?: string) => {
        if (commitType === 'merge') {
            return (
                <div className="flex items-center gap-2">
                    <Badge 
                        variant="outline" 
                        className="bg-purple-500/15 text-purple-500 border-purple-500/20 flex items-center gap-1.5"
                    >
                        <GitMerge className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">Merged</span>
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                        {fromBranch} → {intoBranch}
                    </span>
                </div>
            )
        }

        const statusConfig = {
            verified: { 
                icon: <CheckCircle2 className="h-3.5 w-3.5" />, 
                label: 'Verified',
                className: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/20'
            },
            unverified: { 
                icon: <AlertTriangle className="h-3.5 w-3.5" />, 
                label: 'Pending',
                className: 'bg-amber-500/15 text-amber-500 border-amber-500/20'
            },
            failed: { 
                icon: <XCircle className="h-3.5 w-3.5" />, 
                label: 'Failed',
                className: 'bg-red-500/15 text-red-500 border-red-500/20'
            }
        }[status] || { 
            icon: null, 
            label: status,
            className: 'bg-gray-500/15 text-gray-500 border-gray-500/20'
        }

        return (
            <Badge 
                variant="outline" 
                className={`px-2 py-0.5 rounded-md border ${statusConfig.className} flex items-center gap-1.5`}
            >
                {statusConfig.icon}
                <span className="text-xs font-medium">{statusConfig.label}</span>
            </Badge>
        )
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    const metricsContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    }

    const metricItem = {
        hidden: { opacity: 0, y: 10, scale: 0.95 },
        show: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    }

    const filesContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.3
            }
        }
    }

    const fileItem = {
        hidden: { opacity: 0, x: -20 },
        show: { 
            opacity: 1, 
            x: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    }

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
    }

    // Add this new component for the language display
    const LanguagesList = ({ files, maxDisplay = 5 }: { files: any[], maxDisplay?: number }) => {
        const [showAll, setShowAll] = useState(false)

        // Get unique extensions and their counts
        const langCounts = files.reduce((acc, file) => {
            const ext = file.filename.split('.').pop()?.toLowerCase() || 
                       file.filename.startsWith('.') ? file.filename.substring(1) : 'other'
            acc[ext] = (acc[ext] || 0) + 1
            return acc
        }, {} as Record<string, number>)

        // Convert to array and sort by count
        const languages = Object.entries(langCounts)
            .map(([ext]) => ({
                ext,
                ...LANGUAGE_CONFIG[ext] || { label: ext, color: 'text-gray-400 bg-gray-400/10' }
            }))
            .sort((a, b) => langCounts[b.ext] - langCounts[a.ext])

        const displayLanguages = showAll ? languages : languages.slice(0, maxDisplay)
        const hasMore = languages.length > maxDisplay

        return (
            <div className="flex flex-wrap items-center gap-1.5">
                {displayLanguages.map((lang, idx) => (
                    <span 
                        key={idx} 
                        className={`text-xs font-medium px-1.5 py-0.5 rounded ${lang.color}`}
                    >
                        {lang.ext}
                    </span>
                ))}
                {!showAll && hasMore && (
                    <button
                        onClick={() => setShowAll(true)}
                        className="text-xs text-muted-foreground hover:text-offwhite transition-colors"
                    >
                        +{languages.length - maxDisplay} more
                    </button>
                )}
            </div>
        )
    }

    return (
        <div className="max-w-[1200px] mx-auto py-12 px-4">
            <div className="mb-12">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-semibold mb-6 text-offwhite"
                >
                    Development Timeline
                </motion.h1>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="prose prose-sm dark:prose-invert max-w-2xl space-y-4"
                >
                    <p className="text-muted-foreground leading-relaxed">
                        Track the evolution of our codebase through commits, deployments, and releases. 
                        This timeline provides insights into:
                    </p>
                    <ul className="text-muted-foreground list-disc pl-4 space-y-2">
                        <li>Code changes and improvements</li>
                        <li>Feature deployments and rollouts</li>
                        <li>Bug fixes and performance optimizations</li>
                        <li>Documentation updates and maintenance</li>
                    </ul>
                </motion.div>
            </div>

            {error && (
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg"
                >
                    {error}
                </motion.div>
            )}

            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-border"
            >
                {loading ? (
                    Array(5).fill(0).map((_, i) => (
                        <motion.div key={i} variants={item}>
                            <Card className="p-6 ml-12">
                                <Skeleton className="h-32 w-full" />
                            </Card>
                        </motion.div>
                    ))
                ) : (
                    activities.map((activity, index) => (
                        <motion.div key={index} variants={item}>
                            <div className="relative flex items-start">
                                <div className="absolute left-0 flex items-center justify-center w-10 h-10 rounded-full bg-card border-4 border-background">
                                    {activity.type === 'merge' ? (
                                        activity.isPullRequest ? (
                                            <GitPullRequest className="h-5 w-5 text-purple-500" />
                                        ) : (
                                            <GitMerge className="h-5 w-5 text-purple-500" />
                                        )
                                    ) : (
                                        <GitCommit className="h-5 w-5 text-blue-500" />
                                    )}
                                </div>
                                <Card className="ml-12 p-6 hover:shadow-md transition-all border-l-2 border-l-border w-full">
                                    <div className="flex items-start gap-6">
                                        <Avatar className="h-12 w-12 ring-1 ring-border">
                                            <AvatarImage src={activity.author?.avatar_url} />
                                            <AvatarFallback>{activity.commit.author.name.charAt(0)}</AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="flex items-center gap-2">
                                                    {activity.type === 'merge' ? (
                                                        <div className="p-1.5 rounded-md bg-purple-500/10">
                                                            {activity.isPullRequest ? (
                                                                <GitPullRequest className="h-5 w-5 text-purple-500" />
                                                            ) : (
                                                                <GitMerge className="h-5 w-5 text-purple-500" />
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="p-1.5 rounded-md bg-blue-500/10">
                                                            <GitCommit className="h-5 w-5 text-blue-500" />
                                                        </div>
                                                    )}
                                                    <h3 className="text-lg font-medium text-offwhite">
                                                        {activity.commit.message}
                                                    </h3>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                <div className="flex items-center gap-2.5 text-sm text-muted-foreground/80">
                                                    <div className="p-1.5 rounded-md bg-muted/50">
                                                        <Users className="h-4 w-4" />
                                                    </div>
                                                    <span className="font-medium">{activity.commit.author.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2.5 text-sm text-muted-foreground/80">
                                                    <div className="p-1.5 rounded-md bg-muted/50">
                                                        <Clock className="h-4 w-4" />
                                                    </div>
                                                    <span>{formatDistanceToNow(new Date(activity.commit.author.date), { addSuffix: true })}</span>
                                                </div>
                                                <div className="flex items-center gap-2.5 text-sm text-muted-foreground/80">
                                                    <div className="p-1.5 rounded-md bg-muted/50">
                                                        <GitBranch className="h-4 w-4" />
                                                    </div>
                                                    <span className="capitalize">
                                                        {activity.type === 'merge' ? activity.intoBranch : activity.branch}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {getStatusBadge(
                                                        activity.status, 
                                                        activity.type, 
                                                        activity.fromBranch, 
                                                        activity.intoBranch
                                                    )}
                                                    {activity.type !== 'merge' && (
                                                        <Badge 
                                                            variant={activity.impact === 'major' ? 'destructive' : 'secondary'} 
                                                            className={`px-2 py-0.5 text-xs font-medium ${
                                                                activity.impact === 'major' 
                                                                    ? 'bg-red-500/15 text-red-500 border border-red-500/20' 
                                                                    : 'bg-blue-500/15 text-blue-500 border border-blue-500/20'
                                                            }`}
                                                        >
                                                            {activity.impact} change
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            {activity.stats && (
                                                <motion.div 
                                                    variants={metricsContainer}
                                                    initial="hidden"
                                                    animate="show"
                                                    className="mt-6 mb-4"
                                                >
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        {[
                                                            {
                                                                icon: <FileCode className="h-4 w-4" />,
                                                                title: "Changes",
                                                                content: (
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="flex items-center gap-1.5">
                                                                            <Plus className="h-3.5 w-3.5 text-emerald-500" />
                                                                            <span className="text-sm font-medium text-emerald-500">
                                                                                <NumberFlow value={activity.stats.additions} />
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center gap-1.5">
                                                                            <Minus className="h-3.5 w-3.5 text-red-500" />
                                                                            <span className="text-sm font-medium text-red-500">
                                                                                <NumberFlow value={activity.stats.deletions} />
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            },
                                                            {
                                                                icon: <FileSymlink className="h-4 w-4" />,
                                                                title: "Files Changed",
                                                                content: (
                                                                    <span className="text-sm font-medium text-offwhite">
                                                                        <NumberFlow value={activity.files?.length || 0} /> files
                                                                    </span>
                                                                )
                                                            },
                                                            {
                                                                icon: <Scale className="h-4 w-4" />,
                                                                title: "Size Impact",
                                                                content: (
                                                                    <span className="text-sm font-medium text-offwhite">
                                                                        <NumberFlow value={Math.round(activity.stats?.total || 0)} /> bytes
                                                                    </span>
                                                                )
                                                            },
                                                            {
                                                                icon: <GitBranch className="h-4 w-4" />,
                                                                title: "Languages",
                                                                content: <LanguagesList files={activity.files || []} />
                                                            }
                                                        ].map((metric, index) => (
                                                            <motion.div
                                                                key={index}
                                                                variants={metricItem}
                                                                className="bg-muted/20 rounded-lg p-3 border border-muted/30"
                                                            >
                                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                                                    {metric.icon}
                                                                    <span>{metric.title}</span>
                                                                </div>
                                                                {metric.content}
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}

                                            {activity.files && (
                                                <motion.div 
                                                    variants={filesContainer}
                                                    initial="hidden"
                                                    animate="show"
                                                    className="mt-4 p-4 bg-muted/30 rounded-lg border border-muted/50"
                                                >
                                                    <div className="text-sm font-medium mb-3 text-offwhite/90 flex items-center gap-2">
                                                        <div className="p-1 rounded-md bg-muted/50">
                                                            <File className="h-4 w-4" />
                                                        </div>
                                                        Changed Files
                                                    </div>
                                                    <div className="space-y-2.5">
                                                        {activity.files.map((file: any, fileIndex: number) => (
                                                            <motion.div 
                                                                key={fileIndex} 
                                                                variants={fileItem}
                                                                className="flex items-center justify-between text-sm group hover:bg-muted/20 p-2 rounded-md transition-colors"
                                                            >
                                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                                    <span className={`w-2 h-2 rounded-full ${
                                                                        LANGUAGE_CONFIG[file.filename.split('.').pop()?.toLowerCase()]?.color.split(' ')[0] || 
                                                                        'text-gray-400'
                                                                    }`}>•</span>
                                                                    <span className="truncate text-muted-foreground group-hover:text-offwhite/90 transition-colors">
                                                                        {file.filename}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-3 text-xs font-medium">
                                                                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500">
                                                                        +<NumberFlow value={file.additions} />
                                                                    </span>
                                                                    <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-500">
                                                                        -<NumberFlow value={file.deletions} />
                                                                    </span>
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </motion.div>
                    ))
                )}
            </motion.div>

            {hasMore && !loading && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 text-center"
                >
                    <Button
                        onClick={() => setPage(prev => prev + 1)}
                        variant="outline"
                        className="gap-2 text-muted-foreground hover:text-offwhite transition-colors"
                    >
                        Load More <ChevronDown className="h-5 w-5" />
                    </Button>
                </motion.div>
            )}
        </div>
    )
} 