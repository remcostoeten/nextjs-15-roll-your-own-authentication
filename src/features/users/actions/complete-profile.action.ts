'use server'

import { db } from "@/db"
import { userProfiles } from "@/db/schema"
import { revalidatePath } from "next/cache"
import { completeProfileSchema } from "../schemas/z.complete-profile"

export async function completeProfile(formData: FormData) {
  try {
    const validatedFields = completeProfileSchema.safeParse({
      displayName: formData.get('displayName'),
      bio: formData.get('bio'),
      location: formData.get('location'),
      website: formData.get('website'),
      avatar: formData.get('avatar'),
      timezone: formData.get('timezone'),
      language: formData.get('language'),
      theme: formData.get('theme'),
    })

    if (!validatedFields.success) {
      return { error: validatedFields.error.flatten().fieldErrors }
    }

    await db.insert(userProfiles).values({
      ...validatedFields.data,
      userId: user.id // Get from auth session
    })

    revalidatePath('/dashboard')
    redirect('/dashboard')
  } catch (error) {
    return { error: 'Failed to complete profile' }
  }
} 
