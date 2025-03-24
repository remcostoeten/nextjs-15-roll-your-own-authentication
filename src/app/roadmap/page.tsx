'use client'

import { Header } from '../../components/layout/header'
import { Footer } from '../../components/layout/footer'
import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { NewRoadmapItemModal } from "@/components/roadmap/new-roadmap-item-modal"
import { RoadmapItemDetail } from "@/components/roadmap/roadmap-item-detail"
import { Timeline } from "@/components/roadmap/timeline"
import { Plus } from "lucide-react"


export default function RoadmapPage() {
	const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState<any>(null);
	const [timeframe, setTimeframe] = useState<"DAY" | "WEEK" | "MONTH" | "QUARTER" | "HALF_YEAR" | "YEAR">("MONTH");

	// Example data - replace with actual data from your database
	const items = [
		{
			id: "1",
			title: "Project Setup",
			description: "Initial project setup and configuration",
			startDate: "2024-03-20",
			endDate: "2024-03-25",
			status: "COMPLETED",
			priority: 1,
			progress: 100,
			assigneeId: "remcostoeten",
			assigneeName: "Remco Stoeten",
			assigneeAvatar: "https://github.com/remcostoeten.png",
			row: 0,
			color: "var(--primary)",
		},
		{
			id: "2",
			title: "Authentication System",
			description: "Implement custom authentication with JWT and sessions",
			startDate: "2024-03-25",
			endDate: "2024-03-30",
			status: "IN_PROGRESS",
			priority: 2,
			progress: 60,
			assigneeId: "remcostoeten",
			assigneeName: "Remco Stoeten",
			assigneeAvatar: "https://github.com/remcostoeten.png",
			row: 1,
			color: "var(--primary)",
		},
	];

	const handleNewItem = async (data: any) => {
		// TODO: Implement creating new roadmap item
		console.log("Creating new item:", data);
		setIsNewItemModalOpen(false);
	};

	const handleItemClick = (item: any) => {
		setSelectedItem(item);
	};

	return (
		<div className="min-h-screen bg-[#0D0C0C]">
			<Header />
			<main className="pt-16">
				<div className="container py-6 space-y-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold">Project Roadmap</h1>
							<p className="text-muted-foreground">
								Track development progress and upcoming features
							</p>
						</div>
						<Button onClick={() => setIsNewItemModalOpen(true)}>
							<Plus className="h-4 w-4 mr-2" />
							New Item
						</Button>
					</div>

					<Timeline
						items={items}
						onItemClick={handleItemClick}
						timeframe={timeframe}
					/>

					<NewRoadmapItemModal
						isOpen={isNewItemModalOpen}
						onClose={() => setIsNewItemModalOpen(false)}
						onSubmit={handleNewItem}
					/>

					{selectedItem && (
						<RoadmapItemDetail
							item={selectedItem}
							onClose={() => setSelectedItem(null)}
						/>
					)}
				</div>
			</main>
			<Footer />
		</div>
	)
}
