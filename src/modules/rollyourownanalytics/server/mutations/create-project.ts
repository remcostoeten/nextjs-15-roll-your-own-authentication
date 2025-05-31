'use server'

import { analyticsProjects } from '../schemas/schema-analytics'
import type { TAnalyticsProject } from '../../types'
import { analyticsDb } from '../db/connection'

export async function createProject(data: {
  name: string
  domain: string
  settings?: Record<string, any>
}): Promise<{ success: boolean; project?: TAnalyticsProject; error?: string }> {
  try {
    const project = {
      id: crypto.randomUUID(),
      name: data.name,
      domain: data.domain,
      publicKey: crypto.randomUUID(),
      isActive: true,
      settings: data.settings || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await analyticsDb.insert(analyticsProjects).values({
      ...project,
      settings: project.settings || {}
    })

    return { success: true, project: { ...project, settings: project.settings || {} } }
  } catch (error) {
    console.error('Error creating project:', error)
    return { success: false, error: 'Failed to create project' }
  }
}
