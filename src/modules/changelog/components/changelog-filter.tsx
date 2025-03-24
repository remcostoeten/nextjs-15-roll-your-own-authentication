"use client"
import { motion } from "framer-motion"
import type { ChangelogCategory } from "../types/changelog"

interface ChangelogFilterProps {
  categories: ChangelogCategory[]
  activeFilters: ChangelogCategory[]
  onFilterChange: (filters: ChangelogCategory[]) => void
  onSortChange?: (sortBy: "date" | "votes") => void // Add sort option
  sortBy?: "date" | "votes" // Current sort option
}

const categoryColors: Record<string, { bg: string; text: string; activeBg: string }> = {
  feature: { bg: "bg-blue-500/10", text: "text-blue-400", activeBg: "bg-blue-500" },
  improvement: { bg: "bg-purple-500/10", text: "text-purple-400", activeBg: "bg-purple-500" },
  bugfix: { bg: "bg-green-500/10", text: "text-green-400", activeBg: "bg-green-500" },
  security: { bg: "bg-red-500/10", text: "text-red-400", activeBg: "bg-red-500" },
  performance: { bg: "bg-yellow-500/10", text: "text-yellow-400", activeBg: "bg-yellow-500" },
  documentation: { bg: "bg-gray-500/10", text: "text-gray-400", activeBg: "bg-gray-500" },
  breaking: { bg: "bg-orange-500/10", text: "text-orange-400", activeBg: "bg-orange-500" },
}

export function ChangelogFilter({
  categories,
  activeFilters,
  onFilterChange,
  onSortChange,
  sortBy = "date",
}: ChangelogFilterProps) {
  const toggleFilter = (category: ChangelogCategory) => {
    if (activeFilters.includes(category)) {
      onFilterChange(activeFilters.filter((c) => c !== category))
    } else {
      onFilterChange([...activeFilters, category])
    }
  }

  const clearFilters = () => {
    onFilterChange([])
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-[#F2F0ED]">Filter by category</h3>
        <div className="flex items-center gap-4">
          {/* Add sort options */}
          {onSortChange && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8C877D]">Sort by:</span>
              <div className="flex rounded-md overflow-hidden border border-[#1E1E1E]">
                <button
                  onClick={() => onSortChange("date")}
                  className={`text-xs px-2 py-1 transition-colors ${
                    sortBy === "date" ? "bg-[#1E1E1E] text-[#F2F0ED]" : "text-[#8C877D] hover:bg-[#1E1E1E]/50"
                  }`}
                >
                  Date
                </button>
                <button
                  onClick={() => onSortChange("votes")}
                  className={`text-xs px-2 py-1 transition-colors ${
                    sortBy === "votes" ? "bg-[#1E1E1E] text-[#F2F0ED]" : "text-[#8C877D] hover:bg-[#1E1E1E]/50"
                  }`}
                >
                  Votes
                </button>
              </div>
            </div>
          )}

          {activeFilters.length > 0 && (
            <button onClick={clearFilters} className="text-xs text-[#8C877D] hover:text-[#F2F0ED] transition-colors">
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isActive = activeFilters.includes(category)
          return (
            <motion.button
              key={category}
              onClick={() => toggleFilter(category)}
              className={`
                text-xs px-3 py-1 rounded-full transition-colors duration-200
                ${
                  isActive
                    ? `${categoryColors[category].activeBg} text-white`
                    : `${categoryColors[category].bg} ${categoryColors[category].text}`
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

