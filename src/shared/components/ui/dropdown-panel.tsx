"use client"

import { Popover, PopoverContent, PopoverTrigger } from "ui"
import { cn } from "helpers"
import { ReactNode, ButtonHTMLAttributes } from "react"

interface DropdownPanelProps {
  trigger: ReactNode
  children: ReactNode
  align?: "start" | "center" | "end"
  className?: string
}

export function DropdownPanel({ trigger, children, align = "end", className }: DropdownPanelProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align={align}
        className={cn("w-80 p-0 bg-neutral-900 border border-neutral-800 shadow-lg rounded-md", className)}
      >
        {children}
      </PopoverContent>
    </Popover>
  )
}

export function DropdownHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("px-4 py-3 font-medium text-sm border-b border-neutral-800", className)}>{children}</div>
}

export function DropdownItem({
  children,
  className,
  active,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      className={cn(
        "flex items-center w-full px-4 py-2 text-sm transition-colors",
        "text-neutral-400 hover:text-white hover:bg-neutral-800",
        active && "text-white bg-neutral-800",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

