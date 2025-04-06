"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { db } from "@/server/db"
import { workspaces, workspaceMembers, tasks } from "@/server/db/schema"
import { eq, and } from "drizzle-orm"
import { createId } from "@paralleldrive/cuid2"
import { slugify } from "../helpers/slugify"


// Create workspace validation schema
const createWorkspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required"),
  description: z.string().optional(),
})

// Update workspace validation schema
const updateWorkspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required"),
  description: z.string().optional(),
})

// Create task validation schema
const createTaskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
})

// Update task validation schema
const updateTaskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
})

// Create workspace
export async function createWorkspace(userId: string, formData: FormData) {
  try {
    // Validate form data
    const validatedData = createWorkspaceSchema.parse({
      name: formData.get("name"),
      description: formData.get("description"),
    })

    // Generate slug from name
    const slug = slugify(validatedData.name)

    // Check if workspace with same slug exists
    const existingWorkspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.slug, slug),
    })

    if (existingWorkspace) {
      return { error: "A workspace with a similar name already exists" }
    }

    // Create workspace
    const workspaceId = createId()
    const [workspace] = await db
      .insert(workspaces)
        .values({
          id: workspaceId,
         name: validatedData.name,
        slug,
        description: validatedData.description || "",
        createdById: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    // Add owner as member
    const membershipId = createId()
    await db.insert(workspaceMembers).values({
      id: membershipId,
          workspaceId: workspace.id,
          userId,
      role: "owner",
      joinedAt: new Date(),
    })

    // Log activity
    console.log(`User ${userId} created workspace ${workspace.id}`)

    revalidatePath("/dashboard/workspaces")

    return { success: true, workspaceId: workspace.id, slug: workspace.slug }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    console.error("Create workspace error:", error)
    return { error: "Failed to create workspace" }
  }
}

// Update workspace
export async function updateWorkspace(workspaceId: string, userId: string, formData: FormData) {
  try {
    // Validate form data
    const validatedData = updateWorkspaceSchema.parse({
      name: formData.get("name"),
      description: formData.get("description"),
    })

    // Check if user is owner
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
    })

    if (!workspace) {
      return { error: "Workspace not found" }
    }

    if (workspace.createdById !== userId) {
      return { error: "You don't have permission to update this workspace" }
    }

    // Generate new slug if name changed
    let slug = workspace.slug
    if (validatedData.name !== workspace.name) {
      slug = slugify(validatedData.name)

      // Check if new slug already exists
      const existingWorkspace = await db.query.workspaces.findFirst({
        where: and(eq(workspaces.slug, slug), eq(workspaces.id, workspaceId)),
      })

      if (existingWorkspace && existingWorkspace.id !== workspaceId) {
        return { error: "A workspace with a similar name already exists" }
      }
    }

    // Update workspace
    await db
      .update(workspaces)
      .set({
        name: validatedData.name,
        slug,
        description: validatedData.description || "",
        updatedAt: new Date(),
      })
      .where(eq(workspaces.id, workspaceId))

    // Log activity
    console.log(`User ${userId} updated workspace ${workspaceId}`)

    revalidatePath(`/dashboard/workspaces/${slug}`)

    return { success: true, slug }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    console.error("Update workspace error:", error)
    return { error: "Failed to update workspace" }
  }
}

// Delete workspace
export async function deleteWorkspace(workspaceId: string, userId: string) {
  try {
    // Check if user is owner
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
    })

    if (!workspace) {
      return { error: "Workspace not found" }
    }

    if (workspace.createdById !== userId) {
      return { error: "You don't have permission to delete this workspace" }
    }

    // Delete workspace
    await db.delete(workspaces).where(eq(workspaces.id, workspaceId))

    // Log activity
    console.log(`User ${userId} deleted workspace ${workspaceId}`)

    revalidatePath("/dashboard/workspaces")

    return { success: true }
  } catch (error) {
    console.error("Delete workspace error:", error)
    return { error: "Failed to delete workspace" }
  }
}

export async function createTask(workspaceId: string, formData: FormData) {
  try {
    // Validate form data
    const validatedData = createTaskSchema.parse({
      title: formData.get("title"),
      description: formData.get("description"),
      dueDate: formData.get("dueDate"),
      priority: formData.get("priority"),
    })

    // Check if user is a member of the workspace
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, 
      formData.get("userId") as string
      )),
    })

    if (!membership) {
      return { error: "You don't have permission to create tasks in this workspace" }
    }

    // Create task
    const taskId = createId()
    const [task] = await db
      .insert(tasks)
      .values({
        id: taskId,
        workspaceId,
        title: validatedData.title,
        description: validatedData.description || "",
        status: "todo",
        priority: (validatedData.priority as "low" | "medium" | "high") || "medium",
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
        assignedToId: userId,
        createdById: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    // Log activity
    console.log(`User ${userId} created task ${task.id} in workspace ${workspaceId}`)

    // Get the workspace for the slug
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
    })

    if (!workspace) {
      return { error: "Workspace not found" }
    }

    revalidatePath(`/dashboard/workspaces/${workspace.slug}/tasks`)

    return { success: true, taskId }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    console.error("Create task error:", error)
    return { error: "Failed to create task" }
  }
}

// Update task
export async function updateTask(taskId: string, userId: string, formData: FormData) {
  try {
    // Validate form data
    const validatedData = updateTaskSchema.parse({
      title: formData.get("title"),
      description: formData.get("description"),
      dueDate: formData.get("dueDate"),
      priority: formData.get("priority"),
      status: formData.get("status"),
    })

    // Get task
    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
    })

    if (!task) {
      return { error: "Task not found" }
    }

    // Check if user is a member of the workspace
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(eq(workspaceMembers.workspaceId, task.workspaceId), eq(workspaceMembers.userId, userId)),
    })

    if (!membership) {
      return { error: "You don't have permission to update tasks in this workspace" }
    }

    // Update task
    await db
      .update(tasks)
      .set({
        title: validatedData.title,
        description: validatedData.description || "",
        status: validatedData.status || task.status,
        priority: (validatedData.priority as "low" | "medium" | "high") || task.priority,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : task.dueDate,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, taskId))

    // Log activity
    console.log(`User ${userId} updated task ${taskId}`)

    // Get the workspace for the slug
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, task.workspaceId),
    })

    if (!workspace) {
      return { error: "Workspace not found" }
    }

    revalidatePath(`/dashboard/workspaces/${workspace.slug}/tasks`)

    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    console.error("Update task error:", error)
    return { error: "Failed to update task" }
  }
}

// Delete task
export async function deleteTask(taskId: string, userId: string) {
  try {
    // Get task
    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
    })

    if (!task) {
      return { error: "Task not found" }
    }

    // Check if user is a member of the workspace
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(eq(workspaceMembers.workspaceId, task.workspaceId), eq(workspaceMembers.userId, userId)),
    })

    if (!membership) {
      return { error: "You don't have permission to delete tasks in this workspace" }
    }

    // Delete task
    await db.delete(tasks).where(eq(tasks.id, taskId))

    // Log activity
    console.log(`User ${userId} deleted task ${taskId}`)

    // Get the workspace for the slug
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, task.workspaceId),
    })

    if (!workspace) {
      return { error: "Workspace not found" }
    }

    revalidatePath(`/dashboard/workspaces/${workspace.slug}/tasks`)

    return { success: true }
  } catch (error) {
    console.error("Delete task error:", error)
    return { error: "Failed to delete task" }
  }
}

