'use client'

import GuideLayout from '@/features/guides/components/guide-layout'
import type { GuideMetadata } from '@/features/guides/types/guide'
import LoadingDemo from '@/features/loading/components/loading-demo'
import CodeBlock from '@/shared/_docs/code-block/code-block'
import { Code, Loader, MonitorSmartphone, Sparkles } from 'lucide-react'

const loadingStateCode = `
'use client'

import { useState } from 'react'
import { Progress } from 'ui'

export default function LoadingExample() {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  async function handleLoad() {
    setIsLoading(true)
    setProgress(0)
    
    // Simulate loading with progress
    const duration = 3000
    const steps = 60
    const stepTime = duration / steps
    
    for (let i = 1; i <= steps; i++) {
      await new Promise(r => setTimeout(r, stepTime))
      setProgress((i / steps) * 100)
    }
    
    setIsLoading(false)
  }

  return (
    <div className="space-y-4">
      <Progress value={progress} />
      <Button onClick={handleLoad} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Start'}
      </Button>
    </div>
  )
}`

const skeletonCode = `
function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-4 bg-neutral-800 rounded w-3/4" />
      <div className="h-4 bg-neutral-800 rounded w-1/2" />
      <div className="h-4 bg-neutral-800 rounded w-2/3" />
    </div>
  )
}`

const suspenseCode = `
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AsyncComponent />
    </Suspense>
  )
}`

const guideMetadata: GuideMetadata = {
	title: 'Loading States',
	description:
		'Handle loading states and async operations in client components',
	lastUpdated: '2024-03-20',
	sections: [
		{
			id: 'overview',
			label: 'Overview',
			icon: Sparkles
		},
		{
			id: 'interactive-demo',
			label: 'Interactive Demo',
			icon: MonitorSmartphone,
			subsections: [
				{ id: 'demo-basic', label: 'Basic Demo' },
				{ id: 'demo-advanced', label: 'Advanced Usage' }
			]
		},
		{
			id: 'implementation',
			label: 'Implementation',
			icon: Code,
			subsections: [
				{ id: 'basic-loading', label: 'Basic Loading' },
				{ id: 'skeleton-loading', label: 'Skeleton Loading' },
				{ id: 'suspense', label: 'Suspense Integration' }
			]
		},
		{
			id: 'best-practices',
			label: 'Best Practices',
			icon: Loader
		}
	]
}

export default function ClientLoadingGuide() {
	return (
		<GuideLayout metadata={guideMetadata}>
			<div id="overview" className="space-y-4">
				<p className="text-neutral-400">
					Learn how to implement loading states, progress indicators,
					and skeleton loaders in client-side components. This guide
					covers best practices for handling asynchronous operations
					and providing feedback to users.
				</p>
			</div>

			<section id="interactive-demo" className="space-y-6">
				<h2 className="text-2xl font-semibold">Interactive Demo</h2>

				<div id="demo-basic">
					<h3 className="text-lg font-medium mb-4">
						Basic Loading Demo
					</h3>
					<LoadingDemo initialLoadingTime={3000} />
				</div>

				<div id="demo-advanced">
					<h3 className="text-lg font-medium mb-4">Advanced Usage</h3>
					<p className="text-neutral-400 mb-4">
						Try different loading durations and observe how the UI
						adapts to various states.
					</p>
					<LoadingDemo initialLoadingTime={5000} />
				</div>
			</section>

			<section id="implementation" className="space-y-6">
				<h2 className="text-2xl font-semibold">Implementation</h2>

				<div id="basic-loading" className="space-y-4">
					<h3 className="text-lg font-medium">Basic Loading State</h3>
					<p className="text-neutral-400">
						Implement a basic loading state with progress indicator:
					</p>
					<CodeBlock
						code={loadingStateCode}
						language="typescript"
						fileName="loading-example.tsx"
						showLineNumbers
						enableLineHighlight
						showMetaInfo
					/>
				</div>

				<div id="skeleton-loading" className="space-y-4">
					<h3 className="text-lg font-medium">Skeleton Loading</h3>
					<p className="text-neutral-400">
						Create placeholder UI while content is loading:
					</p>
					<CodeBlock
						code={skeletonCode}
						language="typescript"
						fileName="loading-skeleton.tsx"
						showLineNumbers
						enableLineHighlight
						showMetaInfo
					/>
				</div>

				<div id="suspense" className="space-y-4">
					<h3 className="text-lg font-medium">
						Suspense Integration
					</h3>
					<p className="text-neutral-400">
						Use React Suspense for handling async loading states:
					</p>
					<CodeBlock
						code={suspenseCode}
						language="typescript"
						fileName="page.tsx"
						showLineNumbers
						enableLineHighlight
						showMetaInfo
					/>
				</div>
			</section>

			<section id="best-practices" className="space-y-4">
				<h2 className="text-2xl font-semibold">Best Practices</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="p-4 border border-neutral-800 rounded-lg">
						<h3 className="font-medium mb-2">Do's</h3>
						<ul className="list-disc list-inside space-y-1 text-neutral-400">
							<li>Use skeleton loaders for content</li>
							<li>Show progress for long operations</li>
							<li>Disable interactive elements while loading</li>
							<li>Provide visual feedback for state changes</li>
						</ul>
					</div>
					<div className="p-4 border border-neutral-800 rounded-lg">
						<h3 className="font-medium mb-2">Don'ts</h3>
						<ul className="list-disc list-inside space-y-1 text-neutral-400">
							<li>Block the UI thread during loading</li>
							<li>Use spinners for quick operations</li>
							<li>Forget loading error states</li>
							<li>Cause layout shifts during loading</li>
						</ul>
					</div>
				</div>
			</section>
		</GuideLayout>
	)
}
