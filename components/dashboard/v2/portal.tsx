"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

interface PortalProps {
  children: React.ReactNode
}

export function Portal({ children }: PortalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Make sure we're in the browser environment
  if (!mounted || typeof window === "undefined") return null

  // Create a div for the portal if it doesn't exist
  let portalRoot = document.getElementById("portal-root")
  if (!portalRoot) {
    portalRoot = document.createElement("div")
    portalRoot.id = "portal-root"
    document.body.appendChild(portalRoot)
  }

  return createPortal(children, portalRoot)
}
