"use client"

import { useState, useEffect, useCallback } from "react"
import type { RoadmapItem, RoadmapLane } from "../types"
import { getRoadmap } from "../api/queries/get-roadmap"
import { updateRoadmapItem } from "../api/mutations/update-roadmap-item"
import { mockCurrentUser } from "../api/mock-data"

export function useRoadmap() {
  const [lanes, setLanes] = useState<RoadmapLane[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUser] = useState(mockCurrentUser)
  const isAdmin = currentUser.role === "admin"

  // Fetch roadmap data
  const fetchRoadmap = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getRoadmap()
      setLanes(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load roadmap")
      console.error("Error loading roadmap:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Update a roadmap item
  const updateItem = useCallback(
    async (id: string, data: Partial<RoadmapItem>) => {
      if (!isAdmin) {
        throw new Error("You don't have permission to update roadmap items")
      }

      try {
        const updatedItem = await updateRoadmapItem(id, data)

        // Update local state
        setLanes((prevLanes) =>
          prevLanes.map((lane) => {
            // If item changed status, remove from old lane
            if (data.status && data.status !== lane.id) {
              return {
                ...lane,
                items: lane.items.filter((item) => item.id !== id),
              }
            }

            // If this is the new lane for the item, add it
            if (data.status && data.status === lane.id) {
              // Check if item already exists in this lane
              const itemExists = lane.items.some((item) => item.id === id)
              if (itemExists) {
                // Update the item
                return {
                  ...lane,
                  items: lane.items.map((item) => (item.id === id ? updatedItem : item)),
                }
              } else {
                // Add the item to this lane
                return {
                  ...lane,
                  items: [...lane.items, updatedItem],
                }
              }
            }

            // Otherwise just update the item if it's in this lane
            return {
              ...lane,
              items: lane.items.map((item) => (item.id === id ? updatedItem : item)),
            }
          }),
        )

        return updatedItem
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update roadmap item")
        console.error("Error updating roadmap item:", err)
        throw err
      }
    },
    [isAdmin],
  )

  // Add a vote to a roadmap item
  const voteForItem = useCallback(
    async (id: string) => {
      try {
        // Find the item
        const item = lanes.flatMap((lane) => lane.items).find((item) => item.id === id)
        if (!item) {
          throw new Error("Roadmap item not found")
        }

        // Update the item with an incremented vote count
        return await updateItem(id, { votes: item.votes + 1 })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to vote for roadmap item")
        console.error("Error voting for roadmap item:", err)
        throw err
      }
    },
    [lanes, updateItem],
  )

  // Move an item between lanes
  const moveItem = useCallback(
    async (id: string, newStatus: string) => {
      try {
        return await updateItem(id, { status: newStatus as any })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to move roadmap item")
        console.error("Error moving roadmap item:", err)
        throw err
      }
    },
    [updateItem],
  )

  // Load roadmap on mount
  useEffect(() => {
    fetchRoadmap()
  }, [fetchRoadmap])

  return {
    lanes,
    loading,
    error,
    currentUser,
    isAdmin,
    fetchRoadmap,
    updateItem,
    voteForItem,
    moveItem,
  }
}

