"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { db } from "@/server/db"
import { workspaces, workspaceMembers, workspaceActivities, users } from "@/server/db/schema"
import { eq, and, not, or } from "drizzle-orm"
import { createId } from "@paralleldrive/cuid2"
import { slugify } from "../helpers/slugify"
import { getCurrentUser } from "@/modules/authentication/utilities/auth"
import { createWorkspaceSchema, updateWorkspaceSchema, inviteMemberSchema, updateMemberRoleSchema } from "./models"

export async function createWorkspace(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in" }
  }

  try {
    const validatedData = createWorkspaceSchema.parse({
      name: formData.get("name"),
      description: formData.get("description"),
    })

    const slug = slugify(validatedData.name)

    const existingWorkspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.slug, slug),
    })

    if (existingWorkspace) {
      return { error: "A workspace with a similar name already exists" }
    }

    const workspaceId = createId()
    const [workspace] = await db
      .insert(workspaces)
      .values({
        id: workspaceId,
        name: validatedData.name,
        slug,
        description: validatedData.description || "",
        createdById: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      })
      .returning()

    const membershipId = createId()
    await db.insert(workspaceMembers).values({
      id: membershipId,
      workspaceId: workspace.id,
      userId: user.id,
      role: "owner",
      joinedAt: new Date(),
    })

    const activityId = createId()
    await db.insert(workspaceActivities).values({
      id: activityId,
      workspaceId: workspace.id,
      userId: user.id,
      type: "system",
      content: "Workspace created",
      createdAt: new Date(),
    })

    revalidatePath("/dashboard/workspaces")

    return { success: true, workspaceId: workspace.id, slug: workspace.slug }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "Failed to create workspace" }
  }
}

export async function updateWorkspace(workspaceId: string, formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in" }
  }

  try {
    const validatedData = updateWorkspaceSchema.parse({
      name: formData.get("name"),
      description: formData.get("description"),
    })

    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
    })

    if (!workspace) {
      return { error: "Workspace not found" }
    }

    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, user.id),
        eq(workspaceMembers.role, "owner"),
      ),
    })

    if (!membership) {
      return { error: "You don't have permission to update this workspace" }
    }

    let slug = workspace.slug
    if (validatedData.name !== workspace.name) {
      slug = slugify(validatedData.name)

      const existingWorkspace = await db.query.workspaces.findFirst({
        where: and(eq(workspaces.slug, slug), not(eq(workspaces.id, workspaceId))),
      })

      if (existingWorkspace) {
        return { error: "A workspace with a similar name already exists" }
      }
    }

    await db
      .update(workspaces)
      .set({
        name: validatedData.name,
        slug,
        description: validatedData.description || "",
        updatedAt: new Date(),
      })
      .where(eq(workspaces.id, workspaceId))

    const activityId = createId()
    await db.insert(workspaceActivities).values({
      id: activityId,
      workspaceId,
      userId: user.id,
      type: "system",
      content: "Workspace updated",
      metadata: {
        name: validatedData.name,
        description: validatedData.description,
      },
      createdAt: new Date(),
    })

    revalidatePath(`/dashboard/workspaces/${slug}`)

    return { success: true, slug }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "Failed to update workspace" }
  }
}

export async function inviteWorkspaceMember(workspaceId: string, formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in" }
  }

  try {
    const validatedData = inviteMemberSchema.parse({
      email: formData.get("email"),
      role: formData.get("role"),
    })

    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
    })

    if (!workspace) {
      return { error: "Workspace not found" }
    }

    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, user.id),
        or(eq(workspaceMembers.role, "owner"), eq(workspaceMembers.role, "admin")),
      ),
    })

    if (!membership) {
      return { error: "You don't have permission to invite members to this workspace" }
    }

    const invitedUser = await db.query.users.findFirst({
      where: eq(users.email, validatedData.email),
    })

    if (!invitedUser) {
      return { error: "User not found" }
    }

    const existingMembership = await db.query.workspaceMembers.findFirst({
      where: and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, invitedUser.id)),
    })

    if (existingMembership) {
      return { error: "User is already a member of this workspace" }
    }

    const membershipId = createId()
    await db.insert(workspaceMembers).values({
      id: membershipId,
      workspaceId,
      userId: invitedUser.id,
      role: validatedData.role,
      joinedAt: new Date(),
    })

    const activityId = createId()
    await db.insert(workspaceActivities).values({
      id: activityId,
      workspaceId,
      userId: user.id,
      type: "system",
      content: `${invitedUser.firstName} ${invitedUser.lastName} was added to the workspace`,
      metadata: {
        memberId: invitedUser.id,
        memberName: `${invitedUser.firstName} ${invitedUser.lastName}`,
        role: validatedData.role,
      },
      createdAt: new Date(),
    })

    revalidatePath(`/dashboard/workspaces/${workspace.slug}/members`)

    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "Failed to invite member" }
  }
}

export async function removeWorkspaceMember(workspaceId: string, memberId: string) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in" }
  }

  try {
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
    })

    if (!workspace) {
      return { error: "Workspace not found" }
    }

    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, user.id),
        or(eq(workspaceMembers.role, "owner"), eq(workspaceMembers.role, "admin")),
      ),
    })

    if (!membership) {
      return { error: "You don't have permission to remove members from this workspace" }
    }

    const memberToRemove = await db.query.workspaceMembers.findFirst({
      where: and(eq(workspaceMembers.id, memberId), eq(workspaceMembers.workspaceId, workspaceId)),
      with: {
        user: true,
      },
    })

    if (!memberToRemove) {
      return { error: "Member not found" }
    }

    if (memberToRemove.role === "owner") {
      return { error: "Cannot remove the workspace owner" }
    }

    if (membership.role === "admin" && memberToRemove.role === "admin") {
      return { error: "Admins cannot remove other admins" }
    }

    await db.delete(workspaceMembers).where(eq(workspaceMembers.id, memberId))

    const activityId = createId()
    await db.insert(workspaceActivities).values({
      id: activityId,
      workspaceId,
      userId: user.id,
      type: "system",
      content: `${memberToRemove.user.firstName} ${memberToRemove.user.lastName} was removed from the workspace`,
      metadata: {
        memberId: memberToRemove.user.id,
        memberName: `${memberToRemove.user.firstName} ${memberToRemove.user.lastName}`,
      },
      createdAt: new Date(),
    })

    revalidatePath(`/dashboard/workspaces/${workspace.slug}/members`)

    return { success: true }
  } catch (error) {
    return { error: "Failed to remove member" }
  }
}

export async function updateMemberRole(workspaceId: string, memberId: string, formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in" }
  }

  try {
    const validatedData = updateMemberRoleSchema.parse({
      role: formData.get("role"),
    })

    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
    })

    if (!workspace) {
      return { error: "Workspace not found" }
    }

    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, user.id),
        eq(workspaceMembers.role, "owner"),
      ),
    })

    if (!membership) {
      return { error: "Only the workspace owner can change member roles" }
    }

    const memberToUpdate = await db.query.workspaceMembers.findFirst({
      where: and(eq(workspaceMembers.id, memberId), eq(workspaceMembers.workspaceId, workspaceId)),
      with: {
        user: true,
      },
    })

    if (!memberToUpdate) {
      return { error: "Member not found" }
    }

    if (memberToUpdate.userId === user.id) {
      return { error: "You cannot change your own role" }
    }

    if (validatedData.role === "owner") {
      // Transfer ownership
      await db
        .update(workspaceMembers)
        .set({
          role: "admin",
        })
        .where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, user.id)))
    }

    await db
      .update(workspaceMembers)
      .set({
        role: validatedData.role,
      })
      .where(eq(workspaceMembers.id, memberId))

    const activityId = createId()
    await db.insert(workspaceActivities).values({
      id: activityId,
      workspaceId,
      userId: user.id,
      type: "system",
      content: `${memberToUpdate.user.firstName} ${memberToUpdate.user.lastName}'s role was changed to ${validatedData.role}`,
      metadata: {
        memberId: memberToUpdate.user.id,
        memberName: `${memberToUpdate.user.firstName} ${memberToUpdate.user.lastName}`,
        role: validatedData.role,
      },
      createdAt: new Date(),
    })

    revalidatePath(`/dashboard/workspaces/${workspace.slug}/members`)

    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "Failed to update member role" }
  }
}

export async function createWorkspaceActivity(workspaceId: string, formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in" }
  }

  try {
    const validatedData = createActivitySchema.parse({
      type: formData.get("type"),
      content: formData.get("content"),
      metadata: formData.get("metadata") ? JSON.parse(formData.get("metadata") as string) : undefined,
    })

    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
    })

    if (!workspace) {
      return { error: "Workspace not found" }
    }

    const membership = await db.query.workspaceMembers.findFirst({
      where: and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, user.id)),
    })

    if (!membership) {
      return { error: "You are not a member of this workspace" }
    }

    const activityId = createId()
    await db.insert(workspaceActivities).values({
      id: activityId,
      workspaceId,
      userId: user.id,
      type: validatedData.type,
      content: validatedData.content,
      metadata: validatedData.metadata,
      createdAt: new Date(),
    })

    revalidatePath(`/dashboard/workspaces/${workspace.slug}`)

    return { success: true, activityId }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "Failed to create activity" }
  }
}

