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
    XCircle
} from 'lucide-react'
import { useEffect, useState } from 'react'

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
            
            const [commitsRes, deploymentsRes, releasesRes] = await Promise.all([
                fetch(`https://api.github.com/repos/remcostoeten/nextjs-15-roll-your-own-authentication/commits?page=${page}&per_page=10`),
                fetch(`https://api.github.com/repos/remcostoeten/nextjs-15-roll-your-own-authentication/deployments?page=${page}&per_page=10`),
                fetch(`https://api.github.com/repos/remcostoeten/nextjs-15-roll-your-own-authentication/releases?page=${page}&per_page=10`)
            ])

            if (!commitsRes.ok || !deploymentsRes.ok || !releasesRes.ok) {
                throw new Error('Failed to fetch repository data')
            }

            const [commits, deployments, releases] = await Promise.all([
                commitsRes.json(),
                deploymentsRes.json(),
                releasesRes.json()
            ])

            const enrichedActivities = [...activities, ...commits.map((commit: any) => ({
                ...commit,
                type: 'commit',
                status: commit.commit.verification?.verified ? 'verified' : 'unverified',
                environment: 'development',
                impact: commit.stats?.total > 100 ? 'major' : 'minor'
            }))]

            setActivities(enrichedActivities)
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

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            verified: { icon: <CheckCircle2 className="h-3 w-3" />, color: 'bg-green-500' },
            unverified: { icon: <AlertTriangle className="h-3 w-3" />, color: 'bg-yellow-500' },
            failed: { icon: <XCircle className="h-3 w-3" />, color: 'bg-red-500' }
        }[status] || { icon: null, color: 'bg-gray-500' }

        return (
            <Badge variant="outline" className={`${statusConfig.color} text-white`}>
                {statusConfig.icon}
                <span className="ml-1 capitalize">{status}</span>
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

    return (
        <div className="max-w-[1200px] mx-auto py-12 px-4">
            <div className="mb-16 text-center space-y-4">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-primary/60 bg-clip-text text-transparent"
                >
                    Development Timeline
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed"
                >
                    Track all repository activities, deployments, and releases in real-time
                </motion.p>
            </div>

            {error && (
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8 p-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-lg"
                >
                    {error}
                </motion.div>
            )}

            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-primary/50 before:to-transparent"
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
                                <div className="absolute left-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border-4 border-background">
                                    <GitCommit className="h-5 w-5 text-primary" />
                                </div>
                                <Card className="ml-12 p-6 hover:shadow-lg transition-all border-l-4 border-l-primary/50 w-full">
                                    <div className="flex items-start gap-6">
                                        <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                                            <AvatarImage src={activity.author?.avatar_url} />
                                            <AvatarFallback className="bg-primary/5">{activity.commit.author.name.charAt(0)}</AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <h3 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                                    {activity.commit.message}
                                                </h3>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Users className="h-4 w-4" />
                                                    <span>{activity.commit.author.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{formatDistanceToNow(new Date(activity.commit.author.date), { addSuffix: true })}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Package className="h-4 w-4" />
                                                    <span>{activity.environment}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {getStatusBadge(activity.status)}
                                                    <Badge variant={activity.impact === 'major' ? 'destructive' : 'secondary'}>
                                                        {activity.impact} change
                                                    </Badge>
                                                </div>
                                            </div>

                                            {activity.files && (
                                                <div className="mt-4 p-4 bg-muted rounded-lg">
                                                    <div className="text-sm font-medium mb-2">Changed Files</div>
                                                    <div className="space-y-2">
                                                        {activity.files.map((file: any, fileIndex: number) => (
                                                            <div key={fileIndex} className="flex items-center justify-between text-sm">
                                                                <span className="flex-1 truncate">{file.filename}</span>
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-green-500">+{file.additions}</span>
                                                                    <span className="text-red-500">-{file.deletions}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
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
                    className="mt-12 text-center"
                >
                    <Button
                        onClick={() => setPage(prev => prev + 1)}
                        variant="outline"
                        className="gap-2 text-lg px-8 py-6 rounded-full hover:scale-105 transition-transform"
                    >
                        Load More <ChevronDown className="h-5 w-5" />
                    </Button>
                </motion.div>
            )}
        </div>
    )
} 