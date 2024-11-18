'use client';

import { cn } from "@/lib/utils";
import * as React from "react";

type DrawerProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  side?: 'left' | 'right'
  showBackdrop?: boolean
}

export function Drawer({ 
  children, 
  open, 
  onOpenChange,
  side = 'right',
  showBackdrop = true
}: DrawerProps) {
  return (
    <>
      {showBackdrop && open && (
        <div 
          className={cn(
            "fixed inset-0 z-50 transition-all duration-300",
            "bg-background/80 backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          )}
          onClick={() => onOpenChange?.(false)}
        />
      )}
      <div
        className={cn(
          // Base styles
          "absolute top-0 z-[100] h-screen w-[400px]",
          // Glassmorphism
          "bg-background/40 backdrop-blur-xl backdrop-filter",
          "border-l border-white/20",
          // Shadow and effects
          "shadow-[0_2px_8px_rgba(0,0,0,0.3)]",
          // Transitions
          "transition-all duration-300 ease-in-out",
          // Positioning
          side === 'right' ? 'right-0' : 'left-0',
          // Animation states
          open ? 'translate-x-0' : side === 'right' ? 'translate-x-full' : '-translate-x-full',
          // Animation
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          side === 'right' 
            ? "data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right"
            : "data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
        )}
      >
        <div className="h-full overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
          {children}
        </div>
      </div>
    </>
  )
}
