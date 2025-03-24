import { mockRoadmapLanes } from '../mock-data'
import type { RoadmapLane } from '../../types'

// Mock implementation using the mock data
export async function getRoadmap(): Promise<RoadmapLane[]> {
	// Simulate network delay
	await new Promise((resolve) => setTimeout(resolve, 500))
	return mockRoadmapLanes
}

/*
// Drizzle implementation (commented out)
import { db } from "@/server/db"
import { roadmapItems, roadmapComments, roadmapItemsToTags, roadmapTags } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { RoadmapLane, RoadmapStatus } from "../../types"

export async function getRoadmap(): Promise<RoadmapLane[]> {
  // Get all roadmap items with their comments and tags
  const items = await db.query.roadmapItems.findMany({
    with: {
      comments: true,
      tags: {
        with: {
          tag: true,
        },
      },
      creator: {
        columns: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarUrl: true,
        },
      },
      assignee: {
        columns: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: [
      { priority: "desc" },
      { updatedAt: "desc" },
    ],
  })

  // Transform the data to match our RoadmapItem type
  const transformedItems = items.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    status: item.status,
    priority: item.priority,
    category: item.category,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    createdBy: item.createdBy,
    assignedTo: item.assignedTo,
    dueDate: item.dueDate ? item.dueDate.toISOString() : undefined,
    votes: item.votes,
    comments: item.comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      createdBy: comment.createdBy,
      updatedAt: comment.updatedAt ? comment.updatedAt.toISOString() : undefined,
    })),
    tags: item.tags.map(tag => tag.tag.name),
  }))

  // Group items by status
  const lanes: RoadmapLane[] = [
    {
      id: "planned",
      title: "Planned",
      items: transformedItems.filter(item => item.status === "planned"),
    },
    {
      id: "in-progress",
      title: "In Progress",
      items: transformedItems.filter(item => item.status === "in-progress"),
    },
    {
      id: "completed",
      title: "Completed",
      items: transformedItems.filter(item => item.status === "completed"),
    },
    {
      id: "cancelled",
      title: "Cancelled",
      items: transformedItems.filter(item => item.status === "cancelled"),
    },
  ]

  return lanes
}
*/
