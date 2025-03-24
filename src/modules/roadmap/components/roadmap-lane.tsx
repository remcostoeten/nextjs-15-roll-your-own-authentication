"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { RoadmapLane as RoadmapLaneType, RoadmapItem } from "../types"
import { RoadmapCard } from "./roadmap-card"

interface RoadmapLaneProps {
  lane: RoadmapLaneType
  isAdmin: boolean
  onVote: (id: string) => Promise<void>
  onEdit: (item: RoadmapItem) => void
}

export function RoadmapLane({ lane, isAdmin, onVote, onEdit }: RoadmapLaneProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Get color based on lane
  const getLaneColor = (laneId: string) => {
    switch (laneId) {
      case "planned":
        return "border-blue-500/30"
      case "in-progress":
        return "border-yellow-500/30"
      case "completed":
        return "border-green-500/30"
      case "cancelled":
        return "border-red-500/30"
      default:
        return "border-[#1E1E1E]"
    }
  }

  // Get header color based on lane
  const getLaneHeaderColor = (laneId: string) => {
    switch (laneId) {
      case "planned":
        return "text-blue-400"
      case "in-progress":
        return "text-yellow-400"
      case "completed":
        return "text-green-400"
      case "cancelled":
        return "text-red-400"
      default:
        return "text-[#F2F0ED]"
    }
  }

  return (
    <motion.div
      className={`border ${getLaneColor(lane.id)} rounded-lg bg-[#0D0C0C]/50 backdrop-blur-sm overflow-hidden`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Lane header */}
      <div className="border-b border-[#1E1E1E] p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className={`font-medium ${getLaneHeaderColor(lane.id)}`}>{lane.title}</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#1E1E1E] text-[#8C877D]">{lane.items.length}</span>
        </div>
      </div>

      {/* Lane content */}
      <div className="p-3 h-[calc(100vh-13rem)] overflow-y-auto custom-scrollbar">
        {lane.items.length === 0 ? (
          <div className="flex items-center justify-center h-24 border border-dashed border-[#1E1E1E] rounded-lg">
            <p className="text-sm text-[#8C877D]">No items</p>
          </div>
        ) : (
          lane.items.map((item) => (
            <RoadmapCard key={item.id} item={item} isAdmin={isAdmin} onVote={onVote} onEdit={onEdit} />
          ))
        )}
      </div>

      {/* Matrix-inspired border effect */}
      <div
        className={`h-1 w-full bg-gradient-to-r transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-30"
        }`}
        style={{
          backgroundImage: `linear-gradient(to right, ${
            lane.id === "planned"
              ? "#3b82f6"
              : lane.id === "in-progress"
                ? "#eab308"
                : lane.id === "completed"
                  ? "#22c55e"
                  : "#ef4444"
          }, transparent)`,
        }}
      />
    </motion.div>
  )
}

