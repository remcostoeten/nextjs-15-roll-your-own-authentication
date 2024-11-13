'use client'

import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { DeviceInfo } from '@/features/dashboard/types'
import { cn } from 'helpers'
import { Computer, Laptop, Monitor, Smartphone, Tablet } from 'lucide-react'
import { useState } from 'react'

type DeviceListProps = {
  devices: DeviceInfo[]
  onRevokeAccess: (deviceId: string) => Promise<void>
  className?: string
}

export default function DeviceList({ devices, onRevokeAccess, className }: DeviceListProps) {
  const [isRevoking, setIsRevoking] = useState<string | null>(null)

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="h-5 w-5" />
      case 'tablet':
        return <Tablet className="h-5 w-5" />
      case 'laptop':
        return <Laptop className="h-5 w-5" />
      case 'desktop':
        return <Monitor className="h-5 w-5" />
      default:
        return <Computer className="h-5 w-5" />
    }
  }

  const handleRevoke = async (deviceId: string) => {
    setIsRevoking(deviceId)
    try {
      await onRevokeAccess(deviceId)
    } finally {
      setIsRevoking(null)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Active Devices</CardTitle>
        <CardDescription>
          Devices that are currently logged into your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {devices.map((device) => (
            <div
              key={device.id}
              className={cn(
                'flex items-center justify-between p-4 rounded-lg border',
                device.isCurrent && 'bg-muted'
              )}
            >
              <div className="flex items-center space-x-4">
                {getDeviceIcon(device.deviceType)}
                <div>
                  <p className="font-medium">
                    {device.browser} on {device.os}
                    {device.isCurrent && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        (Current)
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Last active: {new Date(device.lastActive).toLocaleString()}
                  </p>
                  {device.location && (
                    <p className="text-sm text-muted-foreground">
                      Location: {device.location}
                    </p>
                  )}
                </div>
              </div>
              {!device.isCurrent && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRevoke(device.id)}
                  disabled={isRevoking === device.id}
                >
                  {isRevoking === device.id ? 'Revoking...' : 'Revoke Access'}
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
