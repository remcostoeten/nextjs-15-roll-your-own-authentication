"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRoadmap } from "./hooks/use-roadmap"
import { RoadmapHeader } from "./components/roadmap-header"
import { RoadmapFilter } from "./components/roadmap-filter"
import { RoadmapLane } from "./components/roadmap-lane"
import { RoadmapItemDialog } from "./components/roadmap-item-dialog"
import type { RoadmapItem } from "./types"
import { Loader2 } from "lucide-react"
import "./styles/roadmap.css"

export default function RoadmapView() {
  const { lanes, loading, error, isAdmin, voteForItem, updateItem } = useRoadmap()
  const [selectedItem, setSelectedItem] = useState<RoadmapItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleItemClick = (item: RoadmapItem) => {
    setSelectedItem(item)
    setIsDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setSelectedItem(null)
  }

  const handleItemUpdate = async (id: string, data: Partial<RoadmapItem>) => {
    await updateItem(id, data)
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <RoadmapHeader />

      <RoadmapFilter onFilterChange={() => {}} />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-[#4e9815] animate-spin" />
            <p className="text-[#8C877D]">Loading roadmap...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-400 mb-2">Failed to load roadmap</p>
            <p className="text-[#8C877D]">{error}</p>
          </div>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {lanes.map((lane) => (
            <RoadmapLane key={lane.id} lane={lane} isAdmin={isAdmin} onVote={voteForItem} onEdit={handleItemClick} />
          ))}
        </motion.div>
      )}

      <RoadmapItemDialog
        item={selectedItem}
        isOpen={isDialogOpen}
        isAdmin={isAdmin}
        onClose={handleDialogClose}
        onUpdate={handleItemUpdate}
      />

      {/* Matrix-inspired footer */}
      <div className="mt-12 border-t border-[#1E1E1E] pt-6 text-center">
        <p className="text-xs text-[#8C877D] font-mono">
          <span className="text-[#4e9815]">/* </span>
          Vote for features you'd like to see implemented. Only admins can edit the roadmap.
          <span className="text-[#4e9815]"> */</span>
        </p>
      </div>
    </div>
  )
}

