"use client"

import { useGeolocation } from "@/lib/geolocation/client-geolocation"
import { MapPin, Loader2 } from "lucide-react"

export function UserLocationDisplay() {
  const { geolocation, loading, error } = useGeolocation()

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-[#8C877D]">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Detecting your location...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-sm text-[#8C877D]">
        <span>Location unavailable</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-sm text-[#8C877D]">
      <MapPin className="h-4 w-4 text-[#4e9815]" />
      <span>
        {geolocation?.city}, {geolocation?.region}, {geolocation?.country}
      </span>
    </div>
  )
}

