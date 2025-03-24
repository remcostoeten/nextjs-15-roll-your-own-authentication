import { mockRoadmapItems, mockRoadmapLanes } from "../mock-data"
import type { RoadmapItem } from "../../types"

// Mock implementation
export async function updateRoadmapItem(id: string, data: Partial<RoadmapItem>): Promise<RoadmapItem> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Find the item in our mock data
  const itemIndex = mockRoadmapItems.findIndex((item) => item.id === id)
  if (itemIndex === -1) {
    throw new Error(`Roadmap item with id ${id} not found`)
  }

  // Update the item
  const updatedItem = {
    ...mockRoadmapItems[itemIndex],
    ...data,
    updatedAt: new Date().toISOString(),
  }

  // Update our mock data
  mockRoadmapItems[itemIndex] = updatedItem

  // Update the lanes
  const laneIndex = mockRoadmapLanes.findIndex((lane) => lane.id === updatedItem.status)
  if (laneIndex !== -1) {
    // Remove from old lane if status changed
    if (data.status && data.status !== mockRoadmapItems[itemIndex].status) {
      const oldLaneIndex = mockRoadmapLanes.findIndex((lane) => lane.id === mockRoadmapItems[itemIndex].status)
      if (oldLaneIndex !== -1) {
        mockRoadmapLanes[oldLaneIndex].items = mockRoadmapLanes[oldLaneIndex].items.filter((item) => item.id !== id)
      }

      // Add to new lane
      mockRoadmapLanes[laneIndex].items.push(updatedItem)
    } else {
      // Update in current lane
      const itemLaneIndex = mockRoadmapLanes[laneIndex].items.findIndex((item) => item.id === id)
      if (itemLaneIndex !== -1) {
        mockRoadmapLanes[laneIndex].items[itemLaneIndex] = updatedItem
      }
    }
  }

  return updatedItem
}

/*
// Drizzle implementation (commented out)
import { db } from "@/server/db"
import { roadmapItems, roadmapItemsToTags, roadmapTags } from "@/server/db/schema"
import { eq, and } from "drizzle-orm"
import { RoadmapItem } from "../../types"

export async function updateRoadmapItem(id: string, data: Partial<RoadmapItem>): Promise<RoadmapItem> {
  // Start a transaction
  return await db.transaction(async (tx) => {
    // Update the roadmap item
    const updatedItems = await tx
      .update(roadmapItems)
      .set({
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        category: data.category,
        assignedTo: data.assignedTo,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(roadmapItems.id, id))
      .returning()
    
    if (updatedItems.length === 0) {
      throw new Error(`Roadmap item with id ${id} not found`)
    }
    
    // If tags are provided, update them
    if (data.tags) {
      // Delete existing tag associations
      await tx
        .delete(roadmapItemsToTags)
        .where(eq(roadmapItemsToTags.roadmapItemId, id))
      
      // Add new tags
      for (const tagName of data.tags) {
        // Check if tag exists, create if not
        let tag = await tx
          .select()
          .from(roadmapTags)
          .where(eq(roadmapTags.name, tagName))
          .limit(1)
        
        let tagId
        if (tag.length === 0) {
          const newTag = await tx
            .insert(roadmapTags)
            .values({ name: tagName })
            .returning()
          tagId = newTag[0].id
        } else {
          tagId = tag[0].id
        }
        
        // Create association
        await tx
          .insert(roadmapItemsToTags)
          .values({
            roadmapItemId: id,
            tagId,
          })
      }
    }
    
    // Get the updated item with all relations
    const updatedItem = await tx.query.roadmapItems.findFirst({
      where: eq(roadmapItems.id, id),
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
    })
    
    if (!updatedItem) {
      throw new Error(`Failed to retrieve updated roadmap item`)
    }
    
    // Transform to our RoadmapItem type
    return {
      id: updatedItem.id,
      title: updatedItem.title,
      description: updatedItem.description,
      status: updatedItem.status,
      priority: updatedItem.priority,
      category: updatedItem.category,
      createdAt: updatedItem.createdAt.toISOString(),
      updatedAt: updatedItem.updatedAt.toISOString(),
      createdBy: updatedItem.createdBy,
      assignedTo: updatedItem.assignedTo,
      dueDate: updatedItem.dueDate ? updatedItem.dueDate.toISOString() : undefined,
      votes: updatedItem.votes,
      comments: updatedItem.comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
        createdBy: comment.createdBy,
        updatedAt: comment.updatedAt ? comment.updatedAt.toISOString() : undefined,
      })),
      tags: updatedItem.tags.map(tag => tag.tag.name),
    }
  })
}
*/

