"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/server/db"
import {
  snippets,
  categories,
  labels,
  snippetLabels,
  snippetVersions,
  workspaces,
  workspaceMembers,
} from "@/server/db/schema"
import { eq, and, inArray } from "drizzle-orm"
import { createId } from "@paralleldrive/cuid2"
import { nanoid } from "nanoid"
import { getCurrentUser } from "@/modules/authentication/utilities/auth"
import {
  createSnippetSchema,
  updateSnippetSchema,
  createCategorySchema,
  updateCategorySchema,
  createLabelSchema,
  updateLabelSchema,
  bulkOperationSchema,
} from "./models/snippet-models"

// Create a new snippet
export async function createSnippet(workspaceId: string, formData: FormData) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { error: "You must be logged in" }
    }

    // Check if user is a member of the workspace
    const isMember = await db.query.workspaceMembers.findFirst({
      where: and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, user.id)),
    })

    if (!isMember) {
      return { error: "You don't have permission to create snippets in this workspace" }
    }

    // Parse form data
    const rawLabelIds = formData.get("labelIds")
    const labelIds = rawLabelIds ? JSON.parse(rawLabelIds as string) : []

    // Validate form data
    const validatedData = createSnippetSchema.parse({
      title: formData.get("title"),
      content: formData.get("content"),
      language: formData.get("language") || "plain",
      categoryId: formData.get("categoryId") || null,
      isPublic: formData.get("isPublic") === "true",
      isPinned: formData.get("isPinned") === "true",
      isFavorite: formData.get("isFavorite") === "true",
      labelIds,
    })

    // Generate a unique ID for the snippet
    const snippetId = createId()

    // Generate a share ID if the snippet is public
    const shareId = validatedData.isPublic ? nanoid(10) : null

    // Get highest position for ordering
    const [highestPosition] = await db
      .select({ position: snippets.position })
      .from(snippets)
      .where(eq(snippets.workspaceId, workspaceId))
      .orderBy(snippets.position, "desc")
      .limit(1)

    const position = (highestPosition?.position || 0) + 1000 // Leave space between items

    // Create the snippet
    const [snippet] = await db
      .insert(snippets)
      .values({
        id: snippetId,
        title: validatedData.title,
        content: validatedData.content,
        language: validatedData.language,
        categoryId: validatedData.categoryId || null,
        workspaceId,
        createdById: user.id,
        isPublic: validatedData.isPublic,
        isPinned: validatedData.isPinned,
        isFavorite: validatedData.isFavorite,
        isArchived: false,
        shareId,
        position,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    // Add labels if any
    if (validatedData.labelIds.length > 0) {
      const labelEntries = validatedData.labelIds.map((labelId) => ({
        id: createId(),
        snippetId: snippet.id,
        labelId,
      }))

      await db.insert(snippetLabels).values(labelEntries)
    }

    // Create initial version for history
    await db.insert(snippetVersions).values({
      id: createId(),
      snippetId: snippet.id,
      content: validatedData.content,
      createdById: user.id,
      createdAt: new Date(),
    })

    // Get the workspace for the slug
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
    })

    if (!workspace) {
      return { error: "Workspace not found" }
    }

    revalidatePath(`/dashboard/workspaces/${workspace.slug}/snippets`)

    return { success: true, snippetId: snippet.id, shareId: snippet.shareId }
  } catch (error) {
    console.error("Create snippet error:", error)
    return { error: "Failed to create snippet" }
  }
}

// Update an existing snippet
export async function updateSnippet(snippetId: string, formData: FormData) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { error: "You must be logged in" }
    }

    // Get the snippet
    const snippet = await db.query.snippets.findFirst({
      where: eq(snippets.id, snippetId),
    })

    if (!snippet) {
      return { error: "Snippet not found" }
    }

    // Check if user is a member of the workspace
    const isMember = await db.query.workspaceMembers.findFirst({
      where: and(eq(workspaceMembers.workspaceId, snippet.workspaceId), eq(workspaceMembers.userId, user.id)),
    })

    if (!isMember) {
      return { error: "You don't have permission to update this snippet" }
    }

    // Parse form data
    const rawLabelIds = formData.get("labelIds")
    const labelIds = rawLabelIds ? JSON.parse(rawLabelIds as string) : []

    // Validate form data
    const validatedData = updateSnippetSchema.parse({
      title: formData.get("title"),
      content: formData.get("content"),
      language: formData.get("language") || "plain",
      categoryId: formData.get("categoryId") || null,
      isPublic: formData.get("isPublic") === "true",
      isPinned: formData.get("isPinned") === "true",
      isFavorite: formData.get("isFavorite") === "true",
      isArchived: formData.get("isArchived") === "true",
      labelIds,
    })

    // Update share ID if public status changed
    let shareId = snippet.shareId
    if (validatedData.isPublic && !snippet.shareId) {
      shareId = nanoid(10)
    } else if (!validatedData.isPublic) {
      shareId = null
    }

    // Check if content changed to create a new version
    const contentChanged = snippet.content !== validatedData.content

    // Update the snippet
    await db
      .update(snippets)
      .set({
        title: validatedData.title,
        content: validatedData.content,
        language: validatedData.language,
        categoryId: validatedData.categoryId,
        isPublic: validatedData.isPublic,
        isPinned: validatedData.isPinned !== undefined ? validatedData.isPinned : snippet.isPinned,
        isFavorite: validatedData.isFavorite !== undefined ? validatedData.isFavorite : snippet.isFavorite,
        isArchived: validatedData.isArchived !== undefined ? validatedData.isArchived : snippet.isArchived,
        shareId,
        updatedAt: new Date(),
      })
      .where(eq(snippets.id, snippetId))

    // Update labels
    // First, remove all existing labels
    await db.delete(snippetLabels).where(eq(snippetLabels.snippetId, snippetId))

    // Then add the new labels
    if (validatedData.labelIds.length > 0) {
      const labelEntries = validatedData.labelIds.map((labelId) => ({
        id: createId(),
        snippetId,
        labelId,
      }))

      await db.insert(snippetLabels).values(labelEntries)
    }

    // Create a new version if content changed
    if (contentChanged) {
      await db.insert(snippetVersions).values({
        id: createId(),
        snippetId,
        content: validatedData.content,
        createdById: user.id,
        createdAt: new Date(),
      })
    }

    // Get the workspace for the slug
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, snippet.workspaceId),
    })

    if (!workspace) {
      return { error: "Workspace not found" }
    }

    revalidatePath(`/dashboard/workspaces/${workspace.slug}/snippets`)

    return { success: true, shareId }
  } catch (error) {
    console.error("Update snippet error:", error)
    return { error: "Failed to update snippet" }
  }
}

// Toggle pin status
export async function togglePinSnippet(snippetId: string) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { error: "You must be logged in" }
    }

    // Get the snippet
    const snippet = await db.query.snippets.findFirst({
      where: eq(snippets.id, snippetId),
    })

    if (!snippet) {
      return { error: "Snippet not found" }
    }

    // Check if user is a member of the workspace
    const isMember = await db.query.workspaceMembers.findFirst({
      where: and(eq(workspaceMembers.workspaceId, snippet.workspaceId), eq(workspaceMembers.userId, user.id)),
    })

    if (!isMember) {
      return { error: "You don't have permission to update this snippet" }
    }

    // Toggle pin status
    await db
      .update(snippets)
      .set({
        isPinned: !snippet.isPinned,
        updatedAt: new Date(),
      })
      .where(eq(snippets.id, snippetId))

    // Get the workspace for the slug
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, snippet.workspaceId),
    })

    if (!workspace) {
      return { error: "Workspace not found" }
    }

    revalidatePath(`/dashboard/workspaces/${workspace.slug}/snippets`)

    return { success: true, isPinned: !snippet.isPinned }
  } catch (error) {
    console.error("Toggle pin error:", error)
    return { error: "Failed to update snippet" }
  }
}

// Toggle favorite status
export async function toggleFavoriteSnippet(snippetId: string) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { error: "You must be logged in" }
    }

    // Get the snippet
    const snippet = await db.query.snippets.findFirst({
      where: eq(snippets.id, snippetId),
    })

    if (!snippet) {
      return { error: "Snippet not found" }
    }

    // Check if user is a member of the workspace
    const isMember = await db.query.workspaceMembers.findFirst({
      where: and(eq(workspaceMembers.workspaceId, snippet.workspaceId), eq(workspaceMembers.userId, user.id)),
    })

    if (!isMember) {
      return { error: "You don't have permission to update this snippet" }
    }

    // Toggle favorite status
    await db
      .update(snippets)
      .set({
        isFavorite: !snippet.isFavorite,
        updatedAt: new Date(),
      })
      .where(eq(snippets.id, snippetId))

    // Get the workspace for the slug
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, snippet.workspaceId),
    })

    if (!workspace) {
      return { error: "Workspace not found" }
    }

    revalidatePath(`/dashboard/workspaces/${workspace.slug}/snippets`)

    return { success: true, isFavorite: !snippet.isFavorite }
  } catch (error) {
    console.error("Toggle favorite error:", error)
    return { error: "Failed to update snippet" }
  }
}

// Toggle archive status
export async function toggleArchiveSnippet(snippetId: string) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { error: "You must be logged in" }
    }

    // Get the snippet
    const snippet = await db.query.snippets.findFirst({
      where: eq(snippets.id, snippetId),
    })

    if (!snippet) {
      return { error: "Snippet not found" }
    }

    // Check if user is a member of the workspace
    const isMember = await db.query.workspaceMembers.findFirst({
      where: and(eq(workspaceMembers.workspaceId, snippet.workspaceId), eq(workspaceMembers.userId, user.id)),
    })

    if (!isMember) {
      return { error: "You don't have permission to update this snippet" }
    }

    // Toggle archive status
    await db
      .update(snippets)
      .set({
        isArchived: !snippet.isArchived,
        updatedAt: new Date(),
      })
      .where(eq(snippets.id, snippetId))

    // Get the workspace for the slug
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, snippet.workspaceId),
    })

    if (!workspace) {
      return { error: "Workspace not found" }
    }

    revalidatePath(`/dashboard/workspaces/${workspace.slug}/snippets`)

    return { success: true, isArchived: !snippet.isArchived }
  } catch (error) {
    console.error("Toggle archive error:", error)
    return { error: "Failed to update snippet" }
  }
}

// Delete a snippet
export async function deleteSnippet(snippetId: string) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { error: "You must be logged in" }
    }

    // Get the snippet
    const snippet = await db.query.snippets.findFirst({
      where: eq(snippets.id, snippetId),
    })

    if (!snippet) {
      return { error: "Snippet not found" }
    }

    // Check if user is a member of the workspace
    const isMember = await db.query.workspaceMembers.findFirst({
      where: and(eq(workspaceMembers.workspaceId, snippet.workspaceId), eq(workspaceMembers.userId, user.id)),
    })

    if (!isMember) {
      return { error: "You don't have permission to delete this snippet" }
    }

    // Delete the snippet (cascade will handle snippet_labels and versions)
    await db.delete(snippets).where(eq(snippets.id, snippetId))

    // Get the workspace for the slug
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, snippet.workspaceId),
    })

    if (!workspace) {
      return { error: "Workspace not found" }
    }

    revalidatePath(`/dashboard/workspaces/${workspace.slug}/snippets`)

    return { success: true }
  } catch (error) {
    console.error("Delete snippet error:", error)
    return { error: "Failed to delete snippet" }
  }
}

// Bulk operations on snippets
export async function bulkOperateSnippets(workspaceId: string, formData: FormData) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { error: "You must be logged in" }
    }

    // Check if user is a member of the workspace
    const isMember = await db.query.workspaceMembers.findFirst({
      where: and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, user.id)),
    })

    if (!isMember) {
      return { error: "You don't have permission to perform bulk operations in this workspace" }
    }

    // Parse form data
    const rawSnippetIds = formData.get("snippetIds")
    const snippetIds = rawSnippetIds ? JSON.parse(rawSnippetIds as string) : []
    const operation = formData.get("operation") as string
    const labelId = formData.get("labelId") as string | null

    // Validate data
    const validatedData = bulkOperationSchema.parse({
      snippetIds,
      operation,
      labelId: labelId || undefined,
    })

    if (validatedData.snippetIds.length === 0) {
      return { error: "No snippets selected" }
    }

    // Perform the operation
    switch (validatedData.operation) {
      case "archive":
        await db
          .update(snippets)
          .set({ isArchived: true, updatedAt: new Date() })
          .where(inArray(snippets.id, validatedData.snippetIds))
        break
      case "unarchive":
        await db
          .update(snippets)
          .set({ isArchived: false, updatedAt: new Date() })
          .where(inArray(snippets.id, validatedData.snippetIds))
        break
      case "delete":
        await db.delete(snippets).where(inArray(snippets.id, validatedData.snippetIds))
        break
      case "favorite":
        await db
          .update(snippets)
          .set({ isFavorite: true, updatedAt: new Date() })
          .where(inArray(snippets.id, validatedData.snippetIds))
        break
      case "unfavorite":
        await db
          .update(snippets)
          .set({ isFavorite: false, updatedAt: new Date() })
          .where(inArray(snippets.id, validatedData.snippetIds))
        break
      case "pin":
        await db
          .update(snippets)
          .set({ isPinned: true, updatedAt: new Date() })
          .where(inArray(snippets.id, validatedData.snippetIds))
        break
      case "unpin":
        await db
          .update(snippets)
          .set({ isPinned: false, updatedAt: new Date() })
          .where(inArray(snippets.id, validatedData.snippetIds))
        break
      case "addLabel":
        if (!validatedData.labelId) {
          return { error: "Label ID is required for this operation" }
        }

        // Get existing snippet-label connections to avoid duplicates
        const existingConnections = await db
          .select({ snippetId: snippetLabels.snippetId, labelId: snippetLabels.labelId })
          .from(snippetLabels)
          .where(inArray(snippetLabels.snippetId, validatedData.snippetIds))
          .andWhere(eq(snippetLabels.labelId, validatedData.labelId))

        const existingPairs = new Set(existingConnections.map((conn) => `${conn.snippetId}:${conn.labelId}`))

        // Create entries for snippets that don't already have this label
        const newEntries = validatedData.snippetIds
          .filter((snippetId) => !existingPairs.has(`${snippetId}:${validatedData.labelId}`))
          .map((snippetId) => ({
            id: createId(),
            snippetId,
            labelId: validatedData.labelId!,
          }))

        if (newEntries.length > 0) {
          await db.insert(snippetLabels).values(newEntries)
        }
        break
      case "removeLabel":
        if (!validatedData.labelId) {
          return { error: "Label ID is required for this operation" }
        }

        await db
          .delete(snippetLabels)
          .where(inArray(snippetLabels.snippetId, validatedData.snippetIds))
          .andWhere(eq(snippetLabels.labelId, validatedData.labelId))
        break
      default:
        return { error: "Invalid operation" }
    }

    // Get the workspace for the slug
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
    })

    if (!workspace) {
      return { error: "Workspace not found" }
    }

    revalidatePath(`/dashboard/workspaces/${workspace.slug}/snippets`)

    return { success: true }
  } catch (error) {
    console.error("Bulk operation error:", error)
    return { error: "Failed to perform bulk operation" }
  }
}

// Export/download snippets
export async function exportSnippets(workspaceId: string, formData: FormData) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { error: "You must be logged in" }
    }

    // Check if user is a member of the workspace
    const isMember = await db.query.workspaceMembers.findFirst({
      where: and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, user.id)),
    })

    if (!isMember) {
      return { error: "You don't have permission to export snippets from this workspace" }
    }

    // Parse form data
    const rawSnippetIds = formData.get("snippetIds")
    const snippetIds = rawSnippetIds ? JSON.parse(rawSnippetIds as string) : []
    const format = (formData.get("format") as string) || "json"

    if (snippetIds.length === 0) {
      return { error: "No snippets selected" }
    }

    // Fetch the snippets with their related data
    const snippetsData = await db.query.snippets.findMany({
      where: inArray(snippets.id, snippetIds),
      with: {
        category: true,
        labels: {
          with: {
            label: true,
          },
        },
      },
    })

    if (snippetsData.length === 0) {
      return { error: "No snippets found" }
    }

    // Format the data for export
    const exportData = snippetsData.map((snippet) => ({
      title: snippet.title,
      content: snippet.content,
      language: snippet.language,
      category: snippet.category?.name || null,
      labels: snippet.labels.map((l) => l.label.name),
      isPublic: snippet.isPublic,
      createdAt: snippet.createdAt,
      updatedAt: snippet.updatedAt,
    }))

    return {
      success: true,
      data: exportData,
      format,
    }
  } catch (error) {
    console.error("Export snippets error:", error)
    return { error: "Failed to export snippets" }
  }
}

// Create a new category
export async function createCategory(workspaceId: string, formData: FormData) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { error: "You must be logged in" }
    }

    // Check if user is a member of the workspace
    const isMember = await db.query.workspaceMembers.findFirst({
      where: and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, user.id)),
    })

    if (!isMember) {
      return { error: "You don't have permission to create categories in this workspace" }
    }

    // Validate form data
    const validatedData = createCategorySchema.parse({
      name: formData.get("name"),
    })

    // Check if category with same name exists
    const existingCategory = await db.query.categories.findFirst({
      where: and(eq(categories.workspaceId, workspaceId), eq(categories.name, validatedData.name)),
    })

    if (existingCategory) {
      return { error: "A category with this name already exists" }
    }

    // Create the category
    const categoryId = createId()
    const [category] = await db
      .insert(categories)
      .values({
        id: categoryId,
        name: validatedData.name,
        workspaceId,
        createdById: user.id,
        createdAt: new Date(),
      })
      .returning()

    // Get the workspace for the slug
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
    })

    if (!workspace) {
      return { error: "Workspace not found" }
    }

    revalidatePath(`/dashboard/workspaces/${workspace.slug}/snippets`)

    return { success: true, categoryId: category.id }
  } catch (error) {
    console.error("Create category error:", error)
    return { error: "Failed to create category" }
  }
}

// Update a category
export async function updateCategory(categoryId: string, formData: FormData) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { error: "You must be logged in" }
    }

    // Get the category
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, categoryId),
    })

    if (!category) {
      return { error: "Category not found" }
    }

    // Check if user is a member of the workspace
    const isMember = await db.query.workspaceMembers.findFirst({
      where: and(eq(workspaceMembers.workspaceId, category.workspaceId), eq(workspaceMembers.userId, user.id)),
    })

    if (!isMember) {
      return { error: "You don't have permission to update this category" }
    }

    // Validate form data
    const validatedData = updateCategorySchema.parse({
      name: formData.get("name"),
    })

    // Check if category with same name exists
    const existingCategory = await db.query.categories.findFirst({
      where: and(
        eq(categories.workspaceId, category.workspaceId),
        eq(categories.name, validatedData.name),
        eq(categories.id, categoryId, true), // Not the current category
      ),
    })

    if (existingCategory) {
      return { error: "A category with this name already exists" }
    }

    // Update the category
    await db
      .update(categories)
      .set({
        name: validatedData.name,
      })
      .where(eq(categories.id, categoryId))

    // Get the workspace for the slug
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, category.workspaceId),
    })

    if (!workspace) {
      return { error: "Workspace not found" }
    }

    revalidatePath(`/dashboard/workspaces/${workspace.slug}/snippets`)

    return { success: true }
  } catch (error) {
    console.error("Update category error:", error)
    return { error: "Failed to update category" }
  }
}

// Delete a category
export async function deleteCategory(categoryId: string) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { error: "You must be logged in" }
    }

    // Get the category
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, categoryId),
    })

    if (!category) {
      return { error: "Category not found" }
    }

    // Check if user is a member of the workspace
    const isMember = await db.query.workspaceMembers.findFirst({
      where: and(eq(workspaceMembers.workspaceId, category.workspaceId), eq(workspaceMembers.userId, user.id)),
    })

    if (!isMember) {
      return { error: "You don't have permission to delete this category" }
    }

    // Update snippets to remove this category
    await db
      .update(snippets)
      .set({
        categoryId: null,
      })
      .where(eq(snippets.categoryId, categoryId))

    // Delete the category
    await db.delete(categories).where(eq(categories.id, categoryId))

    // Get the workspace for the slug
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, category.workspaceId),
    })

    if (!workspace) {
      return { error: "Workspace not found" }
    }

    revalidatePath(`/dashboard/workspaces/${workspace.slug}/snippets`)

    return { success: true }
  } catch (error) {
    console.error("Delete category error:", error)
    return { error: "Failed to delete category" }
  }
}

// Create a new label
export async function createLabel(workspaceId: string, formData: FormData) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { error: "You must be logged in" }
    }

    // Check if user is a member of the workspace
    const isMember = await db.query.workspaceMembers.findFirst({
      where: and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, user.id)),
    })

    if (!isMember) {
      return { error: "You don't have permission to create labels in this workspace" }
    }

    // Validate form data
    const validatedData = createLabelSchema.parse({
      name: formData.get("name"),
      color: formData.get("color") || "#6366F1",
    })

    // Check if label with same name exists
    const existingLabel = await db.query.labels.findFirst({
      where: and(eq(labels.workspaceId, workspaceId), eq(labels.name, validatedData.name)),
    })

    if (existingLabel) {
      return { error: "A label with this name already exists" }
    }

    // Create the label
    const labelId = createId()
    const [label] = await db
      .insert(labels)
      .values({
        id: labelId,
        name: validatedData.name,
        color: validatedData.color,
        workspaceId,
        createdById: user.id,
        createdAt: new Date(),
      })
      .returning()

    // Get the workspace for the slug
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
    })

    if (!workspace) {
      return { error: "Workspace not found" }
    }

    revalidatePath(`/dashboard/workspaces/${workspace.slug}/snippets`)

    return { success: true, labelId: label.id }
  } catch (error) {
    console.error("Create label error:", error)
    return { error: "Failed to create label" }
  }
}

// Update a label
export async function updateLabel(labelId: string, formData: FormData) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { error: "You must be logged in" }
    }

    // Get the label
    const label = await db.query.labels.findFirst({
      where: eq(labels.id, labelId),
    })

    if (!label) {
      return { error: "Label not found" }
    }

    // Check if user is a member of the workspace
    const isMember = await db.query.workspaceMembers.findFirst({
      where: and(eq(workspaceMembers.workspaceId, label.workspaceId), eq(workspaceMembers.userId, user.id)),
    })

    if (!isMember) {
      return { error: "You don't have permission to update this label" }
    }

    // Validate form data
    const validatedData = updateLabelSchema.parse({
      name: formData.get("name"),
      color: formData.get("color") || "#6366F1",
    })

    // Check if label with same name exists
    const existingLabel = await db.query.labels.findFirst({
      where: and(
        eq(labels.workspaceId, label.workspaceId),
        eq(labels.name, validatedData.name),
        eq(labels.id, labelId, true), // Not the current label
      ),
    })

    if (existingLabel) {
      return { error: "A label with this name already exists" }
    }

    // Update the label
    await db
      .update(labels)
      .set({
        name: validatedData.name,
        color: validatedData.color,
      })
      .where(eq(labels.id, labelId))

    // Get the workspace for the slug
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, label.workspaceId),
    })

    if (!workspace) {
      return { error: "Workspace not found" }
    }

    revalidatePath(`/dashboard/workspaces/${workspace.slug}/snippets`)

    return { success: true }
  } catch (error) {
    console.error("Update label error:", error)
    return { error: "Failed to update label" }
  }
}

// Delete a label
export async function deleteLabel(labelId: string) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { error: "You must be logged in" }
    }

    // Get the label
    const label = await db.query.labels.findFirst({
      where: eq(labels.id, labelId),
    })

    if (!label) {
      return { error: "Label not found" }
    }

    // Check if user is a member of the workspace
    const isMember = await db.query.workspaceMembers.findFirst({
      where: and(eq(workspaceMembers.workspaceId, label.workspaceId), eq(workspaceMembers.userId, user.id)),
    })

    if (!isMember) {
      return { error: "You don't have permission to delete this label" }
    }

    // Delete the label (cascade will handle snippet_labels)
    await db.delete(labels).where(eq(labels.id, labelId))

    // Get the workspace for the slug
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, label.workspaceId),
    })

    if (!workspace) {
      return { error: "Workspace not found" }
    }

    revalidatePath(`/dashboard/workspaces/${workspace.slug}/snippets`)

    return { success: true }
  } catch (error) {
    console.error("Delete label error:", error)
    return { error: "Failed to delete label" }
  }
}

