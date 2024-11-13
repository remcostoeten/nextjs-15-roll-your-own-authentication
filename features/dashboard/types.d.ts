export type DeviceInfo = {
  id: string
  browser: string
  os: string
  deviceType: string
  lastActive: string
  location?: string
  isCurrent: boolean
}

export type ActivityItem = {
  type: string
  timestamp: string
  details?: {
    message?: string
    error?: string
    metadata?: Record<string, unknown>
  } | null
  status: string
}

export type SecurityOverviewStats = {
  totalLogins: number
  failedAttempts: number
  lastLoginLocation?: string
  lastLoginDevice?: string
  passwordLastChanged?: string
  securityScore: number
  activeDevices: number
  devices: DeviceInfo[]
}
