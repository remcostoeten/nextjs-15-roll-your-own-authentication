'use client'

import { fetchActivities } from "@/types/github"


export default function Changelog() {
  const [activities, setActivities] = useState<Array<any>>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setError(null)
        setLoading(true)
        const newActivities = await fetchActivities(page)
        setActivities((prev) => [...prev, ...newActivities])
        setHasMore(newActivities.length === 10)
      } catch (error) {
        console.error('Error fetching activities:', error)
        setError('Failed to load repository data. Please try again later.')
        setHasMore(false)
      } finally {
        setLoading(false)
      }
    }

    loadActivities()
  }, [page])

  const filteredActivities = activities.filter(activity => 
    activeTab === 'all' || activity.type === activeTab
  )

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <div className="max-w-7xl mx-auto py-12 px-4">
        <PageHeader
          title="Development Timeline"
          description="Track all repository activities, deployments, and releases in real-time"
        />

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="bg-[#111111] border border-[#333333]">
            <TabsTrigger value="all" onClick={() => setActiveTab('all')}>All</TabsTrigger>
            <TabsTrigger value="commit" onClick={() => setActiveTab('commit')}>Commits</TabsTrigger>
            <TabsTrigger value="deployment" onClick={() => setActiveTab('deployment')}>Deployments</TabsTrigger>
            <TabsTrigger value="release" onClick={() => setActiveTab('release')}>Releases</TabsTrigger>
          </TabsList>
        </Tabs>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-900/20 text-red-400 rounded-lg border border-red-800"
          >
            {error}
          </motion.div>
        )}

        <ScrollArea className="h-[calc(100vh-250px)] pr-4">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {filteredActivities.map((activity, index) => (
              <ActivityItem key={index} activity={activity} />
            ))}
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
                size="lg"
                className="gap-2 bg-[#111111] text-white hover:bg-[#222222] border border-[#333333]"
              >
                Load More <ChevronDown className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}

