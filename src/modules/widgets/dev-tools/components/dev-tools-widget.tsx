"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, m } from "framer-motion"
import {
    Database,
    Key,
    Settings,
    X,
    Trash2,
    Edit,
    Save,
    Plus,
    Network,
    Terminal,
    Gauge,
    FileJson,
    Wand2,
    Moon,
    Sun,
    FileSlidersIcon as Slider,
    EyeOff,
    Eye,
    CornerRightDown,
    CornerLeftDown,
    CornerLeftUp,
    CornerRightUp,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { ScrollArea } from "@/shared/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip"
import { Slider as UISlider } from "@/shared/components/ui/slider"
import { createDevToolsStore } from "../store/dev-tools-store"

type DevToolsWidgetProps = {
    allowDrag?: boolean
    showInProduction?: boolean
    authInfo?: {
        isAuthenticated: boolean
        user?: {
            name?: string
            email?: string
            createdAt?: Date | string
            isOnline?: boolean
        }
        token?: string
        onLogout?: () => void
        onTokenRefresh?: () => void
    }
}

// Network request monitoring with detailed timing
type NetworkRequest = {
    id: string
    url: string
    method: string
    status: number
    startTime: number
    endTime: number
    duration: number
    size: number
    type: "api" | "asset" | "document" | "font" | "query" | "other"
    queryName?: string
    queryType?: "drizzle" | "prisma" | "raw-sql" | "other"
    initiator: string
    waterfall: {
        dns: number
        connect: number
        ssl: number
        wait: number
        download: number
    }
}

// Console log capture
type ConsoleLog = {
    id: string
    type: "log" | "info" | "warn" | "error"
    message: string
    timestamp: Date
}

// Performance metrics
type PerformanceMetric = {
    name: string
    value: number
    unit: string
}

// Dev tools actions
type DevAction = {
    id: string
    name: string
    description: string
    action: () => void
    icon: React.ReactNode
}

type WidgetPosition = "TOP_LEFT" | "TOP_RIGHT" | "BOTTOM_LEFT" | "BOTTOM_RIGHT" | "CUSTOM"
type WidgetSize = "SMALL" | "NORMAL" | "LARGE"

const useDevToolsStore = createDevToolsStore()

export function DevToolsWidget({ allowDrag = true, showInProduction = false, authInfo }: DevToolsWidgetProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("localStorage")
    const containerRef = useRef<HTMLDivElement>(null)
    const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const hasMovedRef = useRef(false)
    const dragTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
    const [spaceBelow, setSpaceBelow] = useState(0)
    const [actionResult, setActionResult] = useState<string | null>(null)
    const [editingKey, setEditingKey] = useState<string | null>(null)
    const [editValue, setEditValue] = useState("")
    const [newKey, setNewKey] = useState("")
    const [newValue, setNewValue] = useState("")

    // Local storage state
    const [localStorageItems, setLocalStorageItems] = useState<{ key: string; value: string }[]>([])
    const [sessionStorageItems, setSessionStorageItems] = useState<{ key: string; value: string }[]>([])

    // JWT state
    const [jwtParts, setJwtParts] = useState<{ header: any; payload: any; signature: string } | null>(null)

    // Network requests state with detailed timing
    const [networkRequests, setNetworkRequests] = useState<NetworkRequest[]>([
        {
            id: "1",
            url: "/api/users",
            method: "GET",
            status: 200,
            startTime: Date.now() - 350,
            endTime: Date.now() - 230,
            duration: 120,
            size: 1240,
            type: "api",
            initiator: "fetch",
            waterfall: {
                dns: 5,
                connect: 15,
                ssl: 20,
                wait: 50,
                download: 30,
            },
        },
        {
            id: "2",
            url: "/api/db/products",
            method: "GET",
            status: 200,
            startTime: Date.now() - 1200,
            endTime: Date.now() - 650,
            duration: 550,
            size: 8450,
            type: "query",
            queryName: "getProducts",
            queryType: "drizzle",
            initiator: "fetch",
            waterfall: {
                dns: 5,
                connect: 10,
                ssl: 15,
                wait: 480,
                download: 40,
            },
        },
        {
            id: "3",
            url: "/api/db/users",
            method: "POST",
            status: 201,
            startTime: Date.now() - 2500,
            endTime: Date.now() - 2350,
            duration: 150,
            size: 320,
            type: "query",
            queryName: "createUser",
            queryType: "drizzle",
            initiator: "fetch",
            waterfall: {
                dns: 5,
                connect: 10,
                ssl: 15,
                wait: 100,
                download: 20,
            },
        },
        {
            id: "4",
            url: "/api/db/orders",
            method: "GET",
            status: 200,
            startTime: Date.now() - 5000,
            endTime: Date.now() - 3800,
            duration: 1200,
            size: 12500,
            type: "query",
            queryName: "getOrdersWithDetails",
            queryType: "drizzle",
            initiator: "fetch",
            waterfall: {
                dns: 5,
                connect: 10,
                ssl: 15,
                wait: 1150,
                download: 20,
            },
        },
    ])

    // Console logs state
    const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([
        {
            id: "1",
            type: "log",
            message: "Application initialized",
            timestamp: new Date(Date.now() - 120000),
        },
        {
            id: "2",
            type: "info",
            message: "User session started",
            timestamp: new Date(Date.now() - 90000),
        },
        {
            id: "3",
            type: "warn",
            message: "Deprecated method called: useLayoutEffect in SSR",
            timestamp: new Date(Date.now() - 60000),
        },
        {
            id: "4",
            type: "error",
            message: "Failed to load resource: api/data.json (404)",
            timestamp: new Date(Date.now() - 30000),
        },
    ])

    // Performance metrics state
    const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([
        { name: "First Contentful Paint", value: 1.2, unit: "s" },
        { name: "Largest Contentful Paint", value: 2.5, unit: "s" },
        { name: "First Input Delay", value: 120, unit: "ms" },
        { name: "Cumulative Layout Shift", value: 0.05, unit: "" },
        { name: "Memory Usage", value: 42.8, unit: "MB" },
    ])

    // Environment variables state
    const [envVars, setEnvVars] = useState<{ [key: string]: string }>({
        NEXT_PUBLIC_API_URL: "https://api.example.com",
        NEXT_PUBLIC_APP_ENV: "development",
        NEXT_PUBLIC_FEATURE_FLAGS: "new_dashboard,dark_mode",
    })

    const [isVisible, setIsVisible] = useState(true)

    // Get and set position from Zustand store with fallback
    const {
        position,
        setPosition,
        opacity: storedOpacity,
        setOpacity: setStoredOpacity,
        widgetPosition: storedWidgetPosition,
        setWidgetPosition: setStoredWidgetPosition,
        isPinned: storedIsPinned,
        setIsPinned: setStoredIsPinned,
        widgetSize: storedWidgetSize,
        setWidgetSize: setStoredWidgetSize,
        theme: storedTheme,
        setTheme: setStoredTheme,
    } = useDevToolsStore()

    // Update the state initialization to use store values
    const [widgetOpacity, setWidgetOpacity] = useState(storedOpacity || 1)
    const [widgetPosition, setWidgetPosition] = useState<WidgetPosition>(storedWidgetPosition || "CUSTOM")
    const [isPinned, setIsPinned] = useState(storedIsPinned || false)
    const [widgetSize, setWidgetSize] = useState<WidgetSize>(storedWidgetSize || "NORMAL")
    const [isDarkTheme, setIsDarkTheme] = useState(storedTheme === "dark")
    const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 })

    const safePosition = {
        x: typeof position?.x === "number" ? position.x : 20,
        y: typeof position?.y === "number" ? position.y : 20,
    }

    // Load storage data when tab changes or panel opens
    const refreshStorageData = (tab: string) => {
        if (typeof window === "undefined") return

        if (tab === "localStorage" || tab === "all") {
            const items: { key: string; value: string }[] = []
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i)
                if (key) {
                    items.push({
                        key,
                        value: localStorage.getItem(key) || "",
                    })
                }
            }
            setLocalStorageItems(items)
        }

        if (tab === "sessionStorage" || tab === "all") {
            const items: { key: string; value: string }[] = []
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i)
                if (key) {
                    items.push({
                        key,
                        value: sessionStorage.getItem(key) || "",
                    })
                }
            }
            setSessionStorageItems(items)
        }

        if (tab === "jwt" && authInfo?.token) {
            decodeJwt(authInfo.token)
        }
    }

    // Handle tab change
    const handleTabChange = (tab: string) => {
        setActiveTab(tab)
        refreshStorageData(tab)
    }

    // Effect to load data when panel opens
    useEffect(() => {
        if (isOpen) {
            refreshStorageData("all")
        }
    }, [isOpen])

    // Effect to initialize theme
    useEffect(() => {
        if (typeof window !== "undefined") {
            // Check for stored theme preference
            const storedTheme = localStorage.getItem("theme")
            if (storedTheme) {
                setIsDarkTheme(storedTheme === "dark")
                if (storedTheme === "dark") {
                    document.documentElement.classList.add("dark")
                } else {
                    document.documentElement.classList.remove("dark")
                }
            } else {
                // Default to dark theme if no preference is stored
                setIsDarkTheme(true)
                document.documentElement.classList.add("dark")
            }
        }
    }, [])

    // Delete storage item
    const deleteStorageItem = (key: string, storageType: "local" | "session") => {
        if (storageType === "local") {
            localStorage.removeItem(key)
            setLocalStorageItems(localStorageItems.filter((item) => item.key !== key))
        } else {
            sessionStorage.removeItem(key)
            setSessionStorageItems(sessionStorageItems.filter((item) => item.key !== key))
        }
    }

    // Start editing item
    const startEditing = (key: string, value: string) => {
        setEditingKey(key)
        setEditValue(value)
    }

    // Save edited item
    const saveEdit = (key: string, storageType: "local" | "session") => {
        if (storageType === "local") {
            localStorage.setItem(key, editValue)
            setLocalStorageItems(localStorageItems.map((item) => (item.key === key ? { ...item, value: editValue } : item)))
        } else {
            sessionStorage.setItem(key, editValue)
            setSessionStorageItems(
                sessionStorageItems.map((item) => (item.key === key ? { ...item, value: editValue } : item)),
            )
        }
        setEditingKey(null)
    }

    // Add new storage item
    const addNewItem = (storageType: "local" | "session") => {
        if (!newKey.trim()) return

        if (storageType === "local") {
            localStorage.setItem(newKey, newValue)
            setLocalStorageItems([...localStorageItems, { key: newKey, value: newValue }])
        } else {
            sessionStorage.setItem(newKey, newValue)
            setSessionStorageItems([...sessionStorageItems, { key: newKey, value: newValue }])
        }

        setNewKey("")
        setNewValue("")
    }

    // Decode JWT
    const decodeJwt = (token: string) => {
        try {
            const parts = token.split(".")
            if (parts.length !== 3) throw new Error("Invalid JWT format")

            const header = JSON.parse(atob(parts[0]))
            const payload = JSON.parse(atob(parts[1]))

            setJwtParts({
                header,
                payload,
                signature: parts[2],
            })
        } catch (error) {
            console.error("Failed to decode JWT:", error)
            setJwtParts(null)
        }
    }

    // Ensure the widget stays within viewport bounds
    const constrainPosition = (x: number, y: number) => {
        if (typeof window === "undefined") return { x, y }

        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight
        const widgetWidth = 32 // Approximate widget width
        const widgetHeight = 32 // Approximate widget height

        return {
            x: Math.max(0, Math.min(windowWidth - widgetWidth, x)),
            y: Math.max(0, Math.min(windowHeight - widgetHeight, y)),
        }
    }

    const handleDragStart = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!allowDrag) return

        event.preventDefault()
        const startPos = { x: event.clientX - dragPosition.x, y: event.clientY - dragPosition.y }
        hasMovedRef.current = false

        function handleDrag(e: MouseEvent) {
            hasMovedRef.current = true
            setDragPosition({
                x: e.clientX - startPos.x,
                y: e.clientY - startPos.y
            })
        }

        function handleDragEnd() {
            document.removeEventListener('mousemove', handleDrag)
            document.removeEventListener('mouseup', handleDragEnd)
            setIsDragging(false)

            // Clear any existing timeout
            if (dragTimeoutRef.current) {
                clearTimeout(dragTimeoutRef.current)
            }

            // Reset the moved state after a short delay
            dragTimeoutRef.current = setTimeout(() => {
                hasMovedRef.current = false
            }, 100)
        }

        setIsDragging(true)
        document.addEventListener('mousemove', handleDrag)
        document.addEventListener('mouseup', handleDragEnd)
    }

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation()
        // Only toggle if we haven't just finished dragging
        if (!isDragging && !hasMovedRef.current) {
            setIsOpen(prev => !prev)
        }
    }

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (dragTimeoutRef.current) {
                clearTimeout(dragTimeoutRef.current)
            }
        }
    }, [])

    useEffect(() => {
        // Ensure the widget is visible on the screen on initial load
        if (typeof window !== "undefined") {
            const windowWidth = window.innerWidth
            const windowHeight = window.innerHeight

            // Force position to be visible regardless of stored position
            // This ensures the widget is always accessible
            const safeX = Math.max(20, Math.min(windowWidth - 60, safePosition.x))
            const safeY = Math.max(20, Math.min(windowHeight - 60, safePosition.y))

            // If position is outside safe viewport bounds, reset to safe position
            if (safeX !== safePosition.x || safeY !== safePosition.y) {
                setPosition({ x: safeX, y: safeY })
            }

            // Clean up event listeners on unmount
            return () => {
                document.removeEventListener('mousemove', (e: globalThis.MouseEvent) => { })
                document.removeEventListener('mouseup', () => { })
            }
        }
    }, [])

    // Add effect to update space below when needed
    useEffect(() => {
        if (isOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect()
            const windowHeight = window.innerHeight
            setSpaceBelow(windowHeight - rect.bottom)
        }
    }, [isOpen, dragPosition.x, dragPosition.y])

    const calculatePanelPosition = () => {
        if (typeof window === "undefined" || !containerRef.current) {
            return { top: "auto", left: "0", right: "auto", bottom: "100%" }
        }

        const rect = containerRef.current.getBoundingClientRect()
        const widgetHeight = rect.height
        const panelHeight = 400 // Approximate panel height

        // If there's not enough space below, position above
        if (spaceBelow < panelHeight) {
            return {
                bottom: `${widgetHeight + 8}px`, // 8px gap between widget and panel
                left: "0",
                right: "auto",
                top: "auto"
            }
        }

        // Default to positioning below with a small gap
        return {
            top: `${widgetHeight + 8}px`,
            left: "0",
            right: "auto",
            bottom: "auto"
        }
    }

    // Update the opacity setter
    const updateOpacity = (value: number) => {
        setWidgetOpacity(value)
        setStoredOpacity(value)
    }

    // Update the position setter
    function setPresetPosition(position: WidgetPosition) {
        if (typeof window === "undefined") return

        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight

        let newX = safePosition.x
        let newY = safePosition.y

        switch (position) {
            case "TOP_LEFT":
                newX = 20
                newY = 20
                break
            case "TOP_RIGHT":
                newX = windowWidth - 60
                newY = 20
                break
            case "BOTTOM_LEFT":
                newX = 20
                newY = windowHeight - 60
                break
            case "BOTTOM_RIGHT":
                newX = windowWidth - 60
                newY = windowHeight - 60
                break
            default:
                // Keep current position for "CUSTOM"
                break
        }

        setPosition({ x: newX, y: newY })
        setWidgetPosition(position)
        setStoredWidgetPosition(position)
    }

    // Update the pin toggler
    const togglePin = () => {
        const newPinned = !isPinned
        setIsPinned(newPinned)
        setStoredIsPinned(newPinned)
        setActionResult(`Widget ${newPinned ? "pinned" : "unpinned"}`)

        setTimeout(() => {
            setActionResult(null)
        }, 3000)
    }

    // Update the size changer
    const changeWidgetSize = (size: WidgetSize) => {
        setWidgetSize(size)
        setStoredWidgetSize(size)
        setActionResult(`Widget size set to ${size}`)

        setTimeout(() => {
            setActionResult(null)
        }, 3000)
    }

    // Update the theme toggler
    const toggleTheme = () => {
        if (typeof window === "undefined") return

        try {
            const newTheme = isDarkTheme ? "light" : "dark"
            setIsDarkTheme(!isDarkTheme)
            setStoredTheme(newTheme === "dark" ? "dark" : "light")

            // Store theme preference
            localStorage.setItem("theme", newTheme)

            // Apply theme to document
            if (newTheme === "dark") {
                document.documentElement.classList.add("dark")
            } else {
                document.documentElement.classList.remove("dark")
            }

            setActionResult(`Theme changed to ${newTheme}`)

            // Refresh localStorage items if we're on that tab
            if (activeTab === "localStorage") {
                refreshStorageData("localStorage")
            }

            // Clear the result message after 3 seconds
            setTimeout(() => {
                setActionResult(null)
            }, 3000)
        } catch (error) {
            console.error("Error toggling theme:", error)
        }
    }

    const shouldShow = process.env.NODE_ENV === "development" || showInProduction

    const devActions: DevAction[] = [
        {
            id: "clear-local-storage",
            name: "Clear Local Storage",
            description: "Clears all data stored in localStorage.",
            action: () => {
                localStorage.clear()
                refreshStorageData("localStorage")
                setActionResult("Local Storage Cleared")
                setTimeout(() => setActionResult(null), 3000)
            },
            icon: <Trash2 className="w-3.5 h-3.5" />,
        },
        {
            id: "toggle-theme",
            name: "Toggle Theme",
            description: "Toggles between light and dark theme.",
            action: toggleTheme,
            icon: isDarkTheme ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />,
        },
        {
            id: "toggle-visibility",
            name: "Toggle Visibility",
            description: "Hides or shows the widget.",
            action: () => setIsVisible((prev) => !prev),
            icon: isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />,
        },
        {
            id: "reset-position",
            name: "Reset Position",
            description: "Resets the widget to its default position.",
            action: () => setPresetPosition("TOP_LEFT"),
            icon: <Wand2 className="w-3.5 h-3.5" />,
        },
    ]

    if (!shouldShow) {
        return null
    }

    const themeClass = isDarkTheme ? "dark" : "light"

    // First, update the button size based on widgetSize
    const buttonSize = widgetSize === "SMALL" ? "w-6 h-6" : widgetSize === "LARGE" ? "w-10 h-10" : "w-8 h-8"
    const iconSize = widgetSize === "SMALL" ? "w-3 h-3" : widgetSize === "LARGE" ? "w-5 h-5" : "w-4 h-4"

    // Then update the return statement
    return (
        <div className={themeClass}>
            {isVisible && (
                <div
                    className="fixed z-[9999]"
                    style={{
                        transform: `translate(${dragPosition.x}px, ${dragPosition.y}px)`,
                        cursor: isDragging ? 'grabbing' : 'grab',
                        opacity: widgetOpacity,
                        transition: "opacity 0.3s ease"
                    }}
                >
                    <div className="relative" ref={containerRef}>
                        <div
                            className={`${buttonSize} rounded-full flex items-center justify-center cursor-pointer border bg-white dark:bg-zinc-950 border-gray-300 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-zinc-200 shadow-sm`}
                            onMouseDown={handleDragStart}
                            onClick={handleClick}
                        >
                            <Settings className={iconSize} />
                        </div>

                        <AnimatePresence>
                            {isOpen && !isDragging && (
                                <motion.div
                                    className="absolute bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-xl p-4 w-96 text-sm z-[9999]"
                                    style={calculatePanelPosition()}
                                    initial={{ opacity: 0, scale: 0.95, originY: spaceBelow < 400 ? "bottom" : "top" }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-gray-800 dark:text-zinc-100">Developer Tools</h3>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Quick Actions Bar */}
                                    <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-gray-200 dark:border-zinc-800 pb-3">
                                        <TooltipProvider>
                                            {devActions.map((action) => (
                                                <Tooltip key={action.id}>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={action.action}
                                                            className="h-8 gap-1.5 bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800"
                                                        >
                                                            {action.icon}
                                                            <span className="text-xs">{action.name}</span>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{action.description}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            ))}
                                        </TooltipProvider>
                                    </div>

                                    {/* Widget Settings */}
                                    <div className="mb-4 p-3 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-md">
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-zinc-300 mb-3">Widget Settings</h4>

                                        {/* Opacity Control */}
                                        <div className="mb-3">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs text-gray-600 dark:text-zinc-400">Opacity</span>
                                                <span className="text-xs font-mono text-gray-600 dark:text-zinc-400">
                                                    {Math.round(widgetOpacity * 100)}%
                                                </span>
                                            </div>
                                            <UISlider
                                                defaultValue={[widgetOpacity * 100]}
                                                max={100}
                                                min={20}
                                                step={5}
                                                onValueChange={(values) => updateOpacity(values[0] / 100)}
                                                className="py-1"
                                            />
                                        </div>

                                        {/* Position Control */}
                                        <div className="mb-3">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs text-gray-600 dark:text-zinc-400">Position</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setPresetPosition("TOP_LEFT")}
                                                    className={`h-8 text-xs ${widgetPosition === "TOP_LEFT" ? "bg-gray-200 dark:bg-zinc-800" : ""}`}
                                                >
                                                    <CornerLeftUp className="h-3.5 w-3.5 mr-1.5" /> Top Left
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setPresetPosition("TOP_RIGHT")}
                                                    className={`h-8 text-xs ${widgetPosition === "TOP_RIGHT" ? "bg-gray-200 dark:bg-zinc-800" : ""}`}
                                                >
                                                    <CornerRightUp className="h-3.5 w-3.5 mr-1.5" /> Top Right
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setPresetPosition("BOTTOM_LEFT")}
                                                    className={`h-8 text-xs ${widgetPosition === "BOTTOM_LEFT" ? "bg-gray-200 dark:bg-zinc-800" : ""}`}
                                                >
                                                    <CornerLeftDown className="h-3.5 w-3.5 mr-1.5" /> Bottom Left
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setPresetPosition("BOTTOM_RIGHT")}
                                                    className={`h-8 text-xs ${widgetPosition === "BOTTOM_RIGHT" ? "bg-gray-200 dark:bg-zinc-800" : ""}`}
                                                >
                                                    <CornerRightDown className="h-3.5 w-3.5 mr-1.5" /> Bottom Right
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Result Message */}
                                    {actionResult && (
                                        <div className="mb-3 p-2 bg-gray-100 dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-800 rounded text-xs text-center text-gray-800 dark:text-zinc-100 font-medium">
                                            {actionResult}
                                        </div>
                                    )}

                                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                                        <ScrollArea className="w-full max-w-full pb-2">
                                            <TabsList className="w-full flex bg-gray-100 dark:bg-zinc-900/80 p-0.5 rounded-md overflow-x-auto">
                                                <TabsTrigger
                                                    value="localStorage"
                                                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white rounded-md py-1.5 flex gap-1.5 items-center whitespace-nowrap"
                                                >
                                                    <Database className="w-3.5 h-3.5" />
                                                    Local Storage
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="sessionStorage"
                                                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white rounded-md py-1.5 flex gap-1.5 items-center whitespace-nowrap"
                                                >
                                                    <Database className="w-3.5 h-3.5" />
                                                    Session Storage
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="jwt"
                                                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white rounded-md py-1.5 flex gap-1.5 items-center whitespace-nowrap"
                                                >
                                                    <Key className="w-3.5 h-3.5" />
                                                    JWT
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="network"
                                                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white rounded-md py-1.5 flex gap-1.5 items-center whitespace-nowrap"
                                                >
                                                    <Network className="w-3.5 h-3.5" />
                                                    Network
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="console"
                                                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white rounded-md py-1.5 flex gap-1.5 items-center whitespace-nowrap"
                                                >
                                                    <Terminal className="w-3.5 h-3.5" />
                                                    Console
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="performance"
                                                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white rounded-md py-1.5 flex gap-1.5 items-center whitespace-nowrap"
                                                >
                                                    <Gauge className="w-3.5 h-3.5" />
                                                    Performance
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="env"
                                                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white rounded-md py-1.5 flex gap-1.5 items-center whitespace-nowrap"
                                                >
                                                    <FileJson className="w-3.5 h-3.5" />
                                                    Env Vars
                                                </TabsTrigger>
                                            </TabsList>
                                        </ScrollArea>

                                        <TabsContent value="localStorage" className="mt-4 space-y-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Input
                                                    placeholder="Key"
                                                    value={newKey}
                                                    onChange={(e) => setNewKey(e.target.value)}
                                                    className="text-xs h-9 bg-gray-50 dark:bg-zinc-900/80 border-gray-200 dark:border-zinc-800 focus-visible:ring-gray-400 dark:focus-visible:ring-zinc-700 rounded-md"
                                                />
                                                <Input
                                                    placeholder="Value"
                                                    value={newValue}
                                                    onChange={(e) => setNewValue(e.target.value)}
                                                    className="text-xs h-9 bg-gray-50 dark:bg-zinc-900/80 border-gray-200 dark:border-zinc-800 focus-visible:ring-gray-400 dark:focus-visible:ring-zinc-700 rounded-md"
                                                />
                                                <Button
                                                    size="sm"
                                                    onClick={() => addNewItem("local")}
                                                    className="h-9 w-9 p-0 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-md"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <div className="max-h-60 overflow-y-auto space-y-0 pr-1">
                                                {localStorageItems.length === 0 ? (
                                                    <p className="text-gray-500 dark:text-zinc-300 text-xs text-center py-4">
                                                        No items in localStorage
                                                    </p>
                                                ) : (
                                                    localStorageItems.map((item) => (
                                                        <div
                                                            key={item.key}
                                                            className="border border-gray-200 dark:border-zinc-800 rounded-md p-2 bg-gray-50 dark:bg-zinc-900/30 mb-2"
                                                        >
                                                            {editingKey === item.key ? (
                                                                <div className="flex gap-2">
                                                                    <Input
                                                                        value={editValue}
                                                                        onChange={(e) => setEditValue(e.target.value)}
                                                                        className="text-xs flex-1"
                                                                    />
                                                                    <Button size="sm" onClick={() => saveEdit(item.key, "local")} className="h-8">
                                                                        <Save className="h-3 w-3" />
                                                                    </Button>
                                                                </div>
                                                            ) : (
                                                                <div className="flex flex-col gap-1">
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="font-medium text-gray-800 dark:text-zinc-200">{item.key}</span>
                                                                        <div className="flex gap-1">
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-6 w-6 hover:bg-gray-100 dark:hover:bg-zinc-800"
                                                                                onClick={() => startEditing(item.key, item.value)}
                                                                            >
                                                                                <Edit className="h-3.5 w-3.5" />
                                                                            </Button>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-6 w-6 text-red-500 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-red-400"
                                                                                onClick={() => deleteStorageItem(item.key, "local")}
                                                                            >
                                                                                <Trash2 className="h-3.5 w-3.5" />
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                    <div className="bg-gray-100 dark:bg-black/50 p-2 rounded-md text-xs font-mono break-all mt-1">
                                                                        {item.value}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="sessionStorage" className="mt-4 space-y-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Input
                                                    placeholder="Key"
                                                    value={newKey}
                                                    onChange={(e) => setNewKey(e.target.value)}
                                                    className="text-xs h-9 bg-gray-50 dark:bg-zinc-900/80 border-gray-200 dark:border-zinc-800 focus-visible:ring-gray-400 dark:focus-visible:ring-zinc-700 rounded-md"
                                                />
                                                <Input
                                                    placeholder="Value"
                                                    value={newValue}
                                                    onChange={(e) => setNewValue(e.target.value)}
                                                    className="text-xs h-9 bg-gray-50 dark:bg-zinc-900/80 border-gray-200 dark:border-zinc-800 focus-visible:ring-gray-400 dark:focus-visible:ring-zinc-700 rounded-md"
                                                />
                                                <Button
                                                    size="sm"
                                                    onClick={() => addNewItem("session")}
                                                    className="h-9 w-9 p-0 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-md"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <div className="max-h-60 overflow-y-auto space-y-0 pr-1">
                                                {sessionStorageItems.length === 0 ? (
                                                    <p className="text-gray-500 dark:text-zinc-300 text-xs text-center py-4">
                                                        No items in sessionStorage
                                                    </p>
                                                ) : (
                                                    sessionStorageItems.map((item) => (
                                                        <div
                                                            key={item.key}
                                                            className="border border-gray-200 dark:border-zinc-800 rounded-md p-2 bg-gray-50 dark:bg-zinc-900/30 mb-2"
                                                        >
                                                            {editingKey === item.key ? (
                                                                <div className="flex gap-2">
                                                                    <Input
                                                                        value={editValue}
                                                                        onChange={(e) => setEditValue(e.target.value)}
                                                                        className="text-xs flex-1"
                                                                    />
                                                                    <Button size="sm" onClick={() => saveEdit(item.key, "session")} className="h-8">
                                                                        <Save className="h-3 w-3" />
                                                                    </Button>
                                                                </div>
                                                            ) : (
                                                                <div className="flex flex-col gap-1">
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="font-medium text-gray-800 dark:text-zinc-200">{item.key}</span>
                                                                        <div className="flex gap-1">
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-6 w-6 hover:bg-gray-100 dark:hover:bg-zinc-800"
                                                                                onClick={() => startEditing(item.key, item.value)}
                                                                            >
                                                                                <Edit className="h-3.5 w-3.5" />
                                                                            </Button>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-6 w-6 text-red-500 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-red-400"
                                                                                onClick={() => deleteStorageItem(item.key, "session")}
                                                                            >
                                                                                <Trash2 className="h-3.5 w-3.5" />
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                    <div className="bg-gray-100 dark:bg-black/50 p-2 rounded-md text-xs font-mono break-all mt-1">
                                                                        {item.value}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="jwt" className="mt-4">
                                            {authInfo?.token ? (
                                                <div className="space-y-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-xs text-gray-500 dark:text-zinc-500">Raw Token</span>
                                                        <div className="bg-gray-100 dark:bg-black/50 p-2 rounded-md text-xs font-mono break-all max-h-20 overflow-y-auto">
                                                            {authInfo.token}
                                                        </div>
                                                    </div>

                                                    {jwtParts ? (
                                                        <>
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-xs text-gray-500 dark:text-zinc-500">Header</span>
                                                                <div className="bg-gray-100 dark:bg-black/50 p-2 rounded-md text-xs font-mono break-all max-h-20 overflow-y-auto">
                                                                    {JSON.stringify(jwtParts.header, null, 2)}
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-xs text-gray-500 dark:text-zinc-500">Payload</span>
                                                                <div className="bg-gray-100 dark:bg-black/50 p-2 rounded-md text-xs font-mono break-all max-h-40 overflow-y-auto">
                                                                    {JSON.stringify(jwtParts.payload, null, 2)}
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-xs text-gray-500 dark:text-zinc-500">Signature (encoded)</span>
                                                                <div className="bg-gray-100 dark:bg-black/50 p-2 rounded-md text-xs font-mono break-all max-h-20 overflow-y-auto">
                                                                    {jwtParts.signature}
                                                                </div>
                                                            </div>

                                                            {authInfo.onTokenRefresh && (
                                                                <Button onClick={authInfo.onTokenRefresh} className="w-full mt-2 text-xs" size="sm">
                                                                    Refresh Token
                                                                </Button>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <p className="text-red-400 text-xs">Failed to decode JWT token</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="py-8 text-center">
                                                    <p className="text-gray-700 dark:text-zinc-200 text-sm">No JWT token available</p>
                                                    <p className="text-gray-500 dark:text-zinc-300 text-xs mt-1">User is not authenticated</p>
                                                </div>
                                            )}
                                        </TabsContent>

                                        {/* Other tabs would continue here */}
                                    </Tabs>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    )
}

