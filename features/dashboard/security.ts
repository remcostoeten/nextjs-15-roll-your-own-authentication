import { UserData } from "@/features/authentication/types"

export function calculateSecurityScore(userData: UserData): number {
  let score = 0
  
  if (userData.emailVerified) score += 20
  if (userData.lastLoginAttempt) score += 20
  if (userData.passwordChangedAt) score += 20
  if (!userData.recentActivity.some(a => a.status === 'error')) score += 20
  if (userData.role === 'user') score += 20

  return score
} 
