'use server'

import { profiles } from '@/app/server/schema'
import { db } from 'db'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { getUserData } from '../queries'

type UpdateProfileData = {
  avatar?: string
  bio?: string
  phoneNumber?: string
  location?: string
  website?: string
  company?: string
  jobTitle?: string
  twitter?: string
  github?: string
  linkedin?: string
}

export async function updateProfile(data: UpdateProfileData) {
  try {
    const user = await getUserData()
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    await db
      .update(profiles)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(profiles.userId, user.id))

    revalidatePath('/profile')
    return { success: true }
  } catch (error) {
    console.error('Profile update error:', error)
    return { success: false, error: 'Failed to update profile' }
  }
} 
