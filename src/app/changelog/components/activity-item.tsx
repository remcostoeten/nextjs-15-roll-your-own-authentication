import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { motion } from 'framer-motion'
import { ChevronRight, GitBranch, GitCommit, GitPullRequest, Package, Tag } from 'lucide-react'

export default function ActivityItem({ activity }: { activity: any }) {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { color: string; label: string } } = {
      verified: { color: 'bg-green-500', label: 'Verified' },
      unverified: { color: 'bg-yellow-500', label: 'Unverified' },
      failed: { color: 'bg-red-500', label: 'Failed' }
    }
    const config = statusConfig[status] || { color: 'bg-gray-500', label: 'Unknown' }
    return (
      <div className={`border-2 border-solid ${config.color} text-[#000000]`}>
        {config.label}
      </div>
    )
  }
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'commit':
        return <GitCommit size={20} className="text-blue-500" />
      case 'deployment':
        return <Package size={20} className="text-green-500" />
      case 'release':
        return <Tag size={20} className="text-purple-500" />
      default:
        return <GitCommit size={20} className="text-blue-400" />
    }
  }

  return (
    <motion.div variants={item}>
      <Card className="p-6 bg-[#111111] border-[#333333] hover:bg-[#1A1A1A] transition-all">
        <div className="flex items-start gap-6">
          <Avatar className="h-12 w-12 ring-2 ring-blue-500/20">
            <AvatarImage src={activity.author?.avatar_url} />
            <AvatarFallback>{activity.commit?.author?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getTypeIcon(activity.type)}
              <h3 className="text-lg font-semibold text-white truncate">{activity.commit?.message || activity.name || 'Untitled Activity'}</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <GitBranch className="h-4 w-4" />
                <span className="truncate">{activity.commit?.branch || 'main'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <GitPullRequest className="h-4 w-4" />
                <span>{activity.commit?.author?.name || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Package className="h-4 w-4" />
                <span>{activity.environment || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(activity.status)}
                <Badge variant={activity.impact === 'major' ? 'destructive' : 'secondary'}>
                  {activity.impact} change
                </Badge>
              </div>
            </div>

            {activity.files && (
              <Collapsible>
                <CollapsibleTrigger className="flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  View changed files <ChevronRight className="h-4 w-4 ml-1" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-4 p-4 bg-[#1A1A1A] rounded-lg border border-[#333333]">
                    <div className="text-sm font-medium mb-2 text-gray-300">Changed Files</div>
                    <div className="space-y-2">
                      {activity.files.map((file: any, fileIndex: number) => (
                        <div key={fileIndex} className="text-sm">
                          <div className="flex items-center justify-between">
                            <span className="truncate text-gray-400">{file.filename}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-green-400">+{file.additions}</span>
                              <span className="text-red-400">-{file.deletions}</span>
                            </div>
                          </div>
                          <pre className="mt-2 p-2 bg-[#0D0D0D] rounded text-xs overflow-x-auto">
                            <code>{file.patch}</code>
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

