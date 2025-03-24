'use client'

import { useEffect, useState } from 'react'
import { Card, Separator } from 'ui'
import { motion } from 'framer-motion'
import { IconCalendar, IconChevronUp, IconThumbUp } from '@tabler/icons-react'

interface RoadmapItem {
	id: string
	title: string
	description: string
	status: 'planned' | 'in-progress' | 'completed'
	priority: number
	quarter: string
	votes: number
	created_at: string
	updated_at: string
}

export default function RoadmapPage() {
	const [items, setItems] = useState<RoadmapItem[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function fetchRoadmap() {
			try {
				const response = await fetch('/api/roadmap')
				const data = await response.json()
				setItems(data)
			} catch (error) {
				console.error('Error fetching roadmap:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchRoadmap()
	}, [])

	const quarters = Array.from(new Set(items.map((item) => item.quarter))).sort()

	const getStatusColor = (status: RoadmapItem['status']) => {
		switch (status) {
			case 'planned':
				return 'bg-blue-500/10 text-blue-500'
			case 'in-progress':
				return 'bg-yellow-500/10 text-yellow-500'
			case 'completed':
				return 'bg-green-500/10 text-green-500'
			default:
				return 'bg-gray-500/10 text-gray-500'
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-background p-6">
				<div className="max-w-7xl mx-auto">
					<div className="animate-pulse space-y-8">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="h-48 bg-muted rounded-lg"
							/>
						))}
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-6">
			<div className="max-w-7xl mx-auto space-y-8">
				<div>
					<h1 className="text-4xl font-bold mb-2">Product Roadmap</h1>
					<p className="text-muted-foreground">Track the development progress and upcoming features</p>
				</div>

				<Separator />

				{quarters.map((quarter, index) => (
					<motion.div
						key={quarter}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}
					>
						<div className="flex items-center gap-2 mb-4">
							<IconCalendar className="w-5 h-5 text-primary" />
							<h2 className="text-2xl font-semibold">{quarter}</h2>
						</div>

						<div className="grid gap-4">
							{items
								.filter((item) => item.quarter === quarter)
								.sort((a, b) => a.priority - b.priority)
								.map((item) => (
									<Card
										key={item.id}
										className="p-6"
									>
										<div className="flex items-start justify-between">
											<div>
												<div className="flex items-center gap-3 mb-2">
													<h3 className="text-lg font-semibold">{item.title}</h3>
													<span
														className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
															item.status
														)}`}
													>
														{item.status}
													</span>
												</div>
												<p className="text-muted-foreground">{item.description}</p>
											</div>
											<div className="flex items-center gap-2 text-muted-foreground">
												<IconThumbUp className="w-4 h-4" />
												<span>{item.votes}</span>
												<button className="ml-2 p-1 hover:bg-accent rounded-full transition-colors">
													<IconChevronUp className="w-4 h-4" />
												</button>
											</div>
										</div>
									</Card>
								))}
						</div>
					</motion.div>
				))}
			</div>
		</div>
	)
}
