'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Kbd from "@/components/ui/kbd"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { DEMO_ROUTES } from "./config"

export function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <ul className="flex items-center gap-1 p-2 ml-4 text-xs leading-none">
      <li>
        <Link
          href="/docs"
          className="inline-flex items-center appearance-none font-medium text-white no-underline bg-transparent py-3 -my-3"
        >
          <span className="h-6 px-3 inline-flex items-center rounded-xl transition-colors duration-300 hover:bg-white/12 hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
            Docs
          </span>
        </Link>
      </li>
      <li>
        <DropdownMenu onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <button className="inline-flex items-center appearance-none font-medium text-white no-underline bg-transparent py-3 -my-3">
              <span className="h-6 px-3 inline-flex items-center gap-1 rounded-xl transition-colors duration-300 hover:bg-white/12">
                Demos
                <ChevronDown className={cn(
                  "h-4 w-4 opacity-50 transition-transform duration-200",
                  isOpen && "rotate-180"
                )} />
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[400px] p-4 rounded-[20px] bg-[rgba(23,24,37,0.25)] backdrop-blur-[20px]
              shadow-[0_2px_8px_rgba(0,0,0,0.3)]
              dropdown-menu-content overflow-hidden
              border-0"
            sideOffset={4}
          >
            <div className="absolute -top-1 left-[50%] -translate-x-[50%] w-2 h-2 rotate-45 
              bg-[rgba(23,24,37,0.25)] backdrop-blur-[20px]
              transition-all duration-200
              border-0"
            />
            <div className="grid grid-cols-2 gap-4">
              {DEMO_ROUTES.map((route) => (
                <DropdownMenuItem
                  key={route.href}
                  asChild
                  className="focus:bg-white/5 focus:text-white"
                >
                  <Link
                    href={route.href}
                    className="flex items-start p-2 rounded-lg transition-colors hover:bg-white/5"
                  >
                    <route.icon className="h-5 w-5 mr-3 mt-0.5 text-gray-400" />
                    <div>
                      <div className="font-medium text-white mb-1">{route.text}</div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-400">{route.description}</p>
                        {route.text === 'Theme Studio' && (
                          <Kbd>ctrl + /</Kbd>
                        )}
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </li>
    </ul>
  )
} 
