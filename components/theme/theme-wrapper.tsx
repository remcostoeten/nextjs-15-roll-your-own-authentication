'use client'

import Header from "@/components/layout/navigation/Nav"
import { UserProfile } from "@/features/authentication/types"

type Props = {
  user: UserProfile | null
}

export default function ThemeWrapper({ user }: Props) {
  if (!user) return null

  return (
    <Header user={user} />
  )
} 