'use server'

import { db } from "@/api/db"
import { workspaces, workspacePreferences } from "@/api/schema"
import { CreateWorkspaceSchema } from "@/modules/workspaces/api/models/create-workspace-schema"
import { revalidatePath } from "next/cache"
import { getUserSession } from "@/modules/auth/lib/session"
import { sql } from "drizzle-orm"

export async function createWorkspace(data: CreateWorkspaceSchema) {
  try {
    const session = await getUserSession();
    if (!session?.id) {
      return {
        success: false,
        error: "Not authenticated"
      };
    }

    const result = await db.transaction(async (tx) => {
      // Create workspace
      const [workspace] = await tx.insert(workspaces).values({
        name: data.name,
        description: data.description,
        emoji: data.emoji
      }).returning();

      if (!workspace) {
        throw new Error("Failed to create workspace");
      }

      const defaultPreferences = {
        theme: 'system',
        notifications: true,
        language: 'en'
      };

      // Create default workspace preferences using raw SQL
      await tx.execute(sql`
        INSERT INTO workspace_preferences (user_id, workspace_id, preferences)
        VALUES (${session.id}, ${workspace.id}, ${JSON.stringify(defaultPreferences)}::jsonb)
        ON CONFLICT (user_id, workspace_id) 
        DO UPDATE SET 
          preferences = EXCLUDED.preferences,
          updated_at = CURRENT_TIMESTAMP
      `);

      return workspace;
    });

    // Revalidate relevant cache paths
    revalidatePath('/workspaces');
    
    return {
      success: true,
      workspace: result
    };

  } catch (error) {
    console.error("Failed to create workspace:", error);
    return {
      success: false,
      error: "Failed to create workspace. Please try again."
    };
  }
}