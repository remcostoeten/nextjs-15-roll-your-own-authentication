'use client'

import { cn } from '@/shared/helpers'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { format } from 'date-fns'
import {
    Calendar,
    ChevronDown,
    ChevronUp,
    Eye,
    FileCode,
    GitBranch,
    GitCommit,
    GitMerge
} from 'lucide-react'

type ActivityCardProps = {
    activity: any
    showDetails: boolean
    onToggleDetails: () => void
    viewMode: 'list' | 'grid'
}

export function ActivityCard({ activity, showDetails, onToggleDetails, viewMode }: ActivityCardProps) {
    const getActivityIcon = (activity: any) => {
        if ('commit' in activity && !('name' in activity)) return <GitCommit />
        if ('name' in activity) return <GitBranch />
        return <GitMerge />
    }

    const getActivityTitle = (activity: any) => {
        if ('commit' in activity && !('name' in activity)) {
            return `Commit: ${activity.commit.message}`
        }
        if ('name' in activity) {
            return `Branch: ${activity.name}`
        }
        return `Merged PR #${activity.number}: ${activity.title}`
    }

    const getFormattedDate = (activity: any) => {
        const date = activity.commit?.author?.date || activity.merged_at
        if (!date) return 'Unknown date'
        return format(new Date(date), 'PPP')
    }

    return (
        <Card className={cn(
            "p-6 transition-all hover:shadow-lg",
            viewMode === 'grid' ? 'h-full' : ''
        )}>
            <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                    {getActivityIcon(activity)}
                </div>
                
                <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">
                        {getActivityTitle(activity)}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <span>{activity.commit?.author?.name || activity.user?.login}</span>
                        <span>•</span>
                        <Calendar className="h-4 w-4" />
                        <span>{getFormattedDate(activity)}</span>
                    </div>

                    {activity.files && (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onToggleDetails}
                                className="mb-4"
                            >
                                {showDetails ? (
                                    <ChevronUp className="h-4 w-4 mr-2" />
                                ) : (
                                    <ChevronDown className="h-4 w-4 mr-2" />
                                )}
                                {activity.files.length} files changed
                            </Button>

                            {showDetails && (
                                <div className="mt-4 space-y-2">
                                    {activity.files.map((file: any, fileIndex: number) => (
                                        <div key={fileIndex} className="flex items-center gap-2 text-sm">
                                            <FileCode className="h-4 w-4" />
                                            <span className="flex-1 truncate">{file.filename}</span>
                                            <span className="text-green-500">+{file.additions}</span>
                                            <span className="text-red-500">-{file.deletions}</span>
                                            <a
                                                href={file.blob_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="ml-2 hover:text-primary"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </Card>
    )
} 