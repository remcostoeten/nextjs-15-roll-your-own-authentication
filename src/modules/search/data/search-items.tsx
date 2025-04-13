import React from "react"
import type { SearchItem } from "../types"
import { searchItemsConfig } from "../config/shortcuts"

// Convert the config to actual components with rendered icons
export const searchItems: SearchItem[] = searchItemsConfig.map((item) => ({
  ...item,
  icon: React.createElement(item.icon, { className: "w-5 h-5" }),
}))

// Get an item by ID
export function getItemById(id: string): SearchItem | undefined {
  return searchItems.find((item) => item.id === id)
}
