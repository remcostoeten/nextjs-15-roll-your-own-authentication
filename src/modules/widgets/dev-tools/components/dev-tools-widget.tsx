"use client"

import type React from "react"

import { useState, useRef, useEffect, memo, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
import { JSONViewer } from "@/shared/components/json-viewer"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog"

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

// Add new type for panel position
type PanelPlacement = 'top' | 'right' | 'bottom' | 'left' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

const useDevToolsStore = createDevToolsStore()

export function DevToolsWidget({ allowDrag = true, showInProduction = false, authInfo }: DevToolsWidgetProps) {
    // Get values from the store first
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

    // Compute safe position values
    const safePosition = {
        x: typeof position?.x === "number" ? position.x : 20,
        y: typeof position?.y === "number" ? position.y : 20,
    }

    // Then initialize states
    const [isOpen, setIsOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("localStorage")
    const containerRef = useRef<HTMLDivElement>(null)
    // Initialize dragPosition with the safe position
    const [dragPosition, setDragPosition] = useState(safePosition)
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

    // Update the state initialization to use store values
    const [widgetOpacity, setWidgetOpacity] = useState(storedOpacity || 1)
    const [widgetPosition, setWidgetPosition] = useState<WidgetPosition>(storedWidgetPosition || "CUSTOM")
    const [isPinned, setIsPinned] = useState(storedIsPinned || false)
    const [widgetSize, setWidgetSize] = useState<WidgetSize>(storedWidgetSize || "NORMAL")
    const [isDarkTheme, setIsDarkTheme] = useState(storedTheme === "dark")
    const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 })

    const [panelPlacement, setPanelPlacement] = useState<PanelPlacement>('bottom-left');
    const [spaceData, setSpaceData] = useState({
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    });

    // Fix the typed state declaration
    const [showDebugInfo, setShowDebugInfo] = useState<boolean>(process.env.NODE_ENV === 'development' && false);

    // Add adaptive panel size state
    const [panelSize, setPanelSize] = useState({ width: 385, height: 400 });

    // Add state for view all dialog
    const [viewAllData, setViewAllData] = useState<{ title: string; data: string } | null>(null);

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

    // Enhance the constrainPosition function to be more robust
    const constrainPosition = (x: number, y: number) => {
        if (typeof window === "undefined") return { x, y }

        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight
        const WIDGET_SIZE = widgetSize === "SMALL" ? 24 : widgetSize === "LARGE" ? 40 : 32
        const SAFETY_MARGIN = 16 // Keep at least this amount visible

        // Make sure at least part of the widget is visible
        const safeX = Math.max(
            -WIDGET_SIZE + SAFETY_MARGIN,
            Math.min(windowWidth - SAFETY_MARGIN, x)
        )
        const safeY = Math.max(
            -WIDGET_SIZE + SAFETY_MARGIN,
            Math.min(windowHeight - SAFETY_MARGIN, y)
        )

        return { x: safeX, y: safeY }
    }

    // Update the handleDragStart function to use the improved constrainPosition
    const handleDragStart = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!allowDrag) return

        event.preventDefault()
        const startPos = { x: event.clientX - dragPosition.x, y: event.clientY - dragPosition.y }
        hasMovedRef.current = false

        function handleDrag(e: MouseEvent) {
            hasMovedRef.current = true
            // Constrain the position to keep widget visible
            const newPosition = constrainPosition(
                e.clientX - startPos.x,
                e.clientY - startPos.y
            )
            setDragPosition(newPosition)
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

    // Add a viewport boundary check on mount and window resize
    useEffect(() => {
        // Function to ensure widget stays within viewport
        function ensureWidgetIsVisible() {
            if (typeof window === "undefined") return

            // Constrain current position and update if needed
            const safePosition = constrainPosition(dragPosition.x, dragPosition.y)

            // Only update if position actually changed
            if (safePosition.x !== dragPosition.x || safePosition.y !== dragPosition.y) {
                setDragPosition(safePosition)
                // Also update stored position if widget is now in a different position
                setPosition(safePosition)
            }
        }

        // Run on mount
        ensureWidgetIsVisible()

        // Add resize listener
        window.addEventListener('resize', ensureWidgetIsVisible)

        // Clean up
        return () => {
            window.removeEventListener('resize', ensureWidgetIsVisible)
        }
        // Include all dependencies used inside the effect
    }, [dragPosition, widgetSize, setPosition, constrainPosition]);

    // Add effect to update space below when needed
    useEffect(() => {
        if (isOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect()
            const windowHeight = window.innerHeight
            setSpaceBelow(windowHeight - rect.bottom)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, dragPosition.x, dragPosition.y])

    // Enhance space calculation with viewport boundary checking and adaptive sizing
    useEffect(() => {
        if (isOpen && containerRef.current) {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const rect = containerRef.current.getBoundingClientRect();

            // Adjust panel size for very small viewports
            const idealPanelWidth = 385; // Default panel width
            const idealPanelHeight = 400; // Default panel height

            // Adaptive sizing for small screens - never use more than 85% of viewport
            const adaptiveWidth = Math.min(idealPanelWidth, windowWidth * 0.85);
            const adaptiveHeight = Math.min(idealPanelHeight, windowHeight * 0.85);

            setPanelSize({
                width: adaptiveWidth,
                height: adaptiveHeight
            });

            // Get current panel positions
            const spaceAvailable = {
                top: rect.top,
                right: windowWidth - rect.right,
                bottom: windowHeight - rect.bottom,
                left: rect.left,
            };

            setSpaceData(spaceAvailable);

            // Check if element is too close to edges
            const isTooCloseToRightEdge = windowWidth - rect.right < 20;
            const isTooCloseToLeftEdge = rect.left < 20;
            const isTooCloseToTopEdge = rect.top < 20;
            const isTooCloseToBottomEdge = windowHeight - rect.bottom < 20;

            let bestPlacement: PanelPlacement = 'bottom-left'; // Default fallback

            // Check if panel would render outside the viewport in any direction
            const wouldExceedRight = rect.left + adaptiveWidth > windowWidth;
            const wouldExceedLeft = rect.right - adaptiveWidth < 0;
            const wouldExceedTop = rect.bottom - adaptiveHeight < 0;
            const wouldExceedBottom = rect.top + adaptiveHeight > windowHeight;

            // Primary direction logic - check each direction in priority order
            if (spaceAvailable.right >= adaptiveWidth && !isTooCloseToTopEdge && !isTooCloseToBottomEdge) {
                // If there's enough space to the right and not too close to top/bottom edges
                bestPlacement = 'right';
            }
            else if (spaceAvailable.left >= adaptiveWidth && !isTooCloseToTopEdge && !isTooCloseToBottomEdge) {
                // If there's enough space to the left and not too close to top/bottom edges
                bestPlacement = 'left';
            }
            else if (spaceAvailable.bottom >= adaptiveHeight && !wouldExceedRight && !wouldExceedLeft) {
                // If there's enough space below and won't exceed left/right bounds
                bestPlacement = 'bottom';
            }
            else if (spaceAvailable.top >= adaptiveHeight && !wouldExceedRight && !wouldExceedLeft) {
                // If there's enough space above and won't exceed left/right bounds
                bestPlacement = 'top';
            }
            // Corner placement logic - when primary directions aren't feasible
            else {
                // Near right edge of viewport - use left side placements
                if (wouldExceedRight || isTooCloseToRightEdge) {
                    bestPlacement = wouldExceedBottom || isTooCloseToBottomEdge ? 'top-left' : 'bottom-left';
                }
                // Near left edge of viewport - use right side placements
                else if (wouldExceedLeft || isTooCloseToLeftEdge) {
                    bestPlacement = wouldExceedBottom || isTooCloseToBottomEdge ? 'top-right' : 'bottom-right';
                }
                // Near bottom edge - use top placements
                else if (wouldExceedBottom || isTooCloseToBottomEdge) {
                    bestPlacement = wouldExceedRight || rect.left > windowWidth / 2 ? 'top-left' : 'top-right';
                }
                // Near top edge - use bottom placements
                else if (wouldExceedTop || isTooCloseToTopEdge) {
                    bestPlacement = wouldExceedRight || rect.left > windowWidth / 2 ? 'bottom-left' : 'bottom-right';
                }
                // Default corner placement based on quadrant position
                else {
                    const isInRightHalf = rect.left > windowWidth / 2;
                    const isInBottomHalf = rect.top > windowHeight / 2;

                    if (isInRightHalf && isInBottomHalf) {
                        bestPlacement = 'top-left';
                    } else if (isInRightHalf && !isInBottomHalf) {
                        bestPlacement = 'bottom-left';
                    } else if (!isInRightHalf && isInBottomHalf) {
                        bestPlacement = 'top-right';
                    } else {
                        bestPlacement = 'bottom-right';
                    }
                }
            }

            // Final safety check - for extremely small viewports, 
            // choose direction with most available space
            const allDirections = [
                { dir: 'right', space: spaceAvailable.right },
                { dir: 'left', space: spaceAvailable.left },
                { dir: 'top', space: spaceAvailable.top },
                { dir: 'bottom', space: spaceAvailable.bottom }
            ];

            // If all directions have very limited space, use direction with most space
            if (
                spaceAvailable.right < adaptiveWidth &&
                spaceAvailable.left < adaptiveWidth &&
                spaceAvailable.top < adaptiveHeight &&
                spaceAvailable.bottom < adaptiveHeight
            ) {
                // Sort directions by available space (descending)
                allDirections.sort((a, b) => b.space - a.space);

                // Use direction with most available space
                bestPlacement = allDirections[0].dir as PanelPlacement;

                // If even the best direction has very limited space,
                // force center positioning for small viewports
                if (allDirections[0].space < Math.min(adaptiveWidth, adaptiveHeight) * 0.8) {
                    // Special handling for absolute center positioning (rare case)
                    bestPlacement = 'bottom'; // Will be centered in the calculations below

                    // Set very small panel size for extreme cases
                    setPanelSize({
                        width: Math.min(adaptiveWidth, windowWidth * 0.7),
                        height: Math.min(adaptiveHeight, windowHeight * 0.7)
                    });
                }
            }

            setPanelPlacement(bestPlacement);
        }
    }, [isOpen, dragPosition.x, dragPosition.y]);

    // Update panelPosition to account for adaptive sizing
    const panelPosition = useMemo(() => {
        const ARROW_OFFSET = 8; // Gap between widget and panel

        // Helper to center the panel on very small screens
        const centerOffset = (dir: 'horizontal' | 'vertical') => {
            if (typeof window === 'undefined' || !containerRef.current) return '0px';

            const rect = containerRef.current.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            if (dir === 'horizontal') {
                // Ensure panel is centered horizontally but doesn't go off-screen
                const leftPosition = rect.left - (panelSize.width / 2) + (rect.width / 2);
                const rightEdge = leftPosition + panelSize.width;

                if (leftPosition < 10) return '10px'; // Prevent going off left edge
                if (rightEdge > windowWidth - 10) return `${windowWidth - panelSize.width - 10}px`; // Prevent going off right edge

                return `${leftPosition}px`;
            } else {
                // Ensure panel is centered vertically but doesn't go off-screen
                const topPosition = rect.top - (panelSize.height / 2) + (rect.height / 2);
                const bottomEdge = topPosition + panelSize.height;

                if (topPosition < 10) return '10px'; // Prevent going off top edge
                if (bottomEdge > windowHeight - 10) return `${windowHeight - panelSize.height - 10}px`; // Prevent going off bottom edge

                return `${topPosition}px`;
            }
        };

        // For extremely cramped viewports, use absolute positioning
        const isExtremelyCramped = typeof window !== 'undefined' &&
            panelSize.width > window.innerWidth * 0.7 &&
            panelSize.height > window.innerHeight * 0.7;

        if (isExtremelyCramped) {
            return {
                position: 'fixed' as const,
                top: centerOffset('vertical'),
                left: centerOffset('horizontal'),
                transform: 'none',
                right: 'auto',
                bottom: 'auto',
            };
        }

        switch (panelPlacement) {
            case 'right':
                return {
                    top: '0',
                    left: `calc(100% + ${ARROW_OFFSET}px)`,
                    right: 'auto',
                    bottom: 'auto'
                };
            case 'left':
                return {
                    top: '0',
                    right: `calc(100% + ${ARROW_OFFSET}px)`,
                    left: 'auto',
                    bottom: 'auto'
                };
            case 'top':
                return {
                    bottom: `calc(100% + ${ARROW_OFFSET}px)`,
                    left: '0',
                    right: 'auto',
                    top: 'auto'
                };
            case 'bottom':
                return {
                    top: `calc(100% + ${ARROW_OFFSET}px)`,
                    left: '0',
                    right: 'auto',
                    bottom: 'auto'
                };
            case 'top-right':
                return {
                    bottom: `calc(100% + ${ARROW_OFFSET}px)`,
                    left: 'auto',
                    right: '0',
                    top: 'auto'
                };
            case 'top-left':
                return {
                    bottom: `calc(100% + ${ARROW_OFFSET}px)`,
                    left: '0',
                    right: 'auto',
                    top: 'auto'
                };
            case 'bottom-right':
                return {
                    top: `calc(100% + ${ARROW_OFFSET}px)`,
                    left: 'auto',
                    right: '0',
                    bottom: 'auto'
                };
            case 'bottom-left':
            default:
                return {
                    top: `calc(100% + ${ARROW_OFFSET}px)`,
                    left: '0',
                    right: 'auto',
                    bottom: 'auto'
                };
        }
    }, [panelPlacement, panelSize, containerRef]);

    // Update arrowPosition to hide arrow when using absolute positioning
    const arrowPosition = useMemo(() => {
        // For extremely cramped viewports, hide the arrow
        const isExtremelyCramped = typeof window !== 'undefined' &&
            panelSize.width > window.innerWidth * 0.7 &&
            panelSize.height > window.innerHeight * 0.7;

        if (isExtremelyCramped) {
            return {
                display: 'none'
            };
        }

        switch (panelPlacement) {
            case 'right':
                return {
                    top: '12px',
                    left: '-6px',
                    bottom: 'auto',
                    right: 'auto',
                    transform: 'rotate(-45deg)'
                };
            case 'left':
                return {
                    top: '12px',
                    right: '-6px',
                    bottom: 'auto',
                    left: 'auto',
                    transform: 'rotate(135deg)'
                };
            case 'top':
                return {
                    bottom: '-6px',
                    left: '12px',
                    top: 'auto',
                    right: 'auto',
                    transform: 'rotate(225deg)'
                };
            case 'bottom':
                return {
                    top: '-6px',
                    left: '12px',
                    bottom: 'auto',
                    right: 'auto',
                    transform: 'rotate(45deg)'
                };
            case 'top-right':
                return {
                    bottom: '-6px',
                    right: '12px',
                    top: 'auto',
                    left: 'auto',
                    transform: 'rotate(225deg)'
                };
            case 'top-left':
                return {
                    bottom: '-6px',
                    left: '12px',
                    top: 'auto',
                    right: 'auto',
                    transform: 'rotate(225deg)'
                };
            case 'bottom-right':
                return {
                    top: '-6px',
                    right: '12px',
                    bottom: 'auto',
                    left: 'auto',
                    transform: 'rotate(45deg)'
                };
            case 'bottom-left':
            default:
                return {
                    top: '-6px',
                    left: '12px',
                    bottom: 'auto',
                    right: 'auto',
                    transform: 'rotate(45deg)'
                };
        }
    }, [panelPlacement, panelSize]);

    // Replace the getPanelAnimation function with useMemo
    const panelAnimation = useMemo(() => {
        // Base for all animations
        const base = {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.9 },
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 25
            }
        };

        // Add direction-specific transform
        switch (panelPlacement) {
            case 'right':
                return {
                    ...base,
                    initial: { ...base.initial, x: -10 },
                    animate: { ...base.animate, x: 0 },
                    exit: { ...base.exit, x: -10 },
                };
            case 'left':
                return {
                    ...base,
                    initial: { ...base.initial, x: 10 },
                    animate: { ...base.animate, x: 0 },
                    exit: { ...base.exit, x: 10 },
                };
            case 'top':
                return {
                    ...base,
                    initial: { ...base.initial, y: 10 },
                    animate: { ...base.animate, y: 0 },
                    exit: { ...base.exit, y: 10 },
                };
            case 'bottom':
                return {
                    ...base,
                    initial: { ...base.initial, y: -10 },
                    animate: { ...base.animate, y: 0 },
                    exit: { ...base.exit, y: -10 },
                };
            case 'top-right':
            case 'top-left':
                return {
                    ...base,
                    initial: { ...base.initial, y: 10 },
                    animate: { ...base.animate, y: 0 },
                    exit: { ...base.exit, y: 10 },
                };
            case 'bottom-right':
            case 'bottom-left':
            default:
                return {
                    ...base,
                    initial: { ...base.initial, y: -10 },
                    animate: { ...base.animate, y: 0 },
                    exit: { ...base.exit, y: -10 },
                };
        }
    }, [panelPlacement]);

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

        // Update both stored position and visual position
        setPosition({ x: newX, y: newY })
        setDragPosition({ x: newX, y: newY })
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
            action: () => {
                const newVisibility = !isVisible;
                setIsVisible(newVisibility);
                setIsOpen(false); // Close popover panel

                if (!newVisibility) {
                    // Save current opacity before hiding
                    const currentOpacity = widgetOpacity;
                    if (currentOpacity > 0.1) {
                        setStoredOpacity(currentOpacity);
                    }
                    // Set low opacity when hidden
                    setWidgetOpacity(0.1);
                } else {
                    // Restore to previously stored opacity or default
                    setWidgetOpacity(storedOpacity || 1);
                }

                setActionResult(`Widget ${newVisibility ? "visible" : "dimmed"}`);
                setTimeout(() => setActionResult(null), 3000);
            },
            icon: isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />,
        },
        {
            id: "reset-position",
            name: "Reset Position",
            description: "Resets the widget to its default position.",
            action: () => setPresetPosition("TOP_LEFT"),
            icon: <Wand2 className="w-3.5 h-3.5" />,
        },
        {
            id: "toggle-debug",
            name: "Toggle Debug Info",
            description: "Shows or hides positioning debug information",
            action: () => {
                setShowDebugInfo(!showDebugInfo);
                setActionResult(`Debug info ${!showDebugInfo ? 'shown' : 'hidden'}`);
                setTimeout(() => setActionResult(null), 3000);
            },
            icon: <Slider className="w-3.5 h-3.5" />,
        },
    ]

    // Modify the handleViewAllItems function
    const handleViewAllItems = (storageType: "local" | "session") => {
        // Create a simplified view of all items as a single JSON object
        const items = storageType === "local" ? localStorageItems : sessionStorageItems;
        const combinedData = items.reduce((acc, item) => {
            try {
                // Try to parse the value first
                acc[item.key] = JSON.parse(item.value);
            } catch {
                // If not valid JSON, just use the string
                acc[item.key] = item.value;
            }
            return acc;
        }, {} as Record<string, any>);

        // Set the data to show in the modal
        setViewAllData({
            title: `All ${storageType === "local" ? "localStorage" : "sessionStorage"} Items`,
            data: JSON.stringify(combinedData, null, 2)
        });
    };

    // Function to close the modal
    const handleCloseViewAll = () => {
        setViewAllData(null);
    };

    if (!shouldShow) {
        return null
    }

    const themeClass = isDarkTheme ? "dark" : "light"

    // First, update the button size based on widgetSize
    const buttonSize = widgetSize === "SMALL" ? "w-6 h-6" : widgetSize === "LARGE" ? "w-10 h-10" : "w-8 h-8"
    const iconSize = widgetSize === "SMALL" ? "w-3 h-3" : widgetSize === "LARGE" ? "w-5 h-5" : "w-4 h-4"

    return (
        <div className={themeClass}>
            <div
                className="fixed z-[9999]"
                style={{
                    transform: `translate(${dragPosition.x}px, ${dragPosition.y}px)`,
                    cursor: isDragging ? 'grabbing' : 'grab',
                    opacity: widgetOpacity,
                    transition: "opacity 0.3s ease",
                    pointerEvents: isVisible ? 'auto' : 'none'
                }}
            >
                {/* Display the debug info if enabled */}
                {showDebugInfo && (
                    <div className="absolute -top-12 -left-1 bg-black/90 text-white text-[10px] px-2 py-1 rounded-sm whitespace-nowrap z-[10000]">
                        Pos: {Math.round(dragPosition.x)},{Math.round(dragPosition.y)} |
                        Placement: {panelPlacement} |
                        Space: T:{Math.round(spaceData.top)} R:{Math.round(spaceData.right)} B:{Math.round(spaceData.bottom)} L:{Math.round(spaceData.left)}
                    </div>
                )}

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
                                className="absolute z-[9999]"
                                style={{
                                    ...panelPosition,
                                    width: `${panelSize.width}px`,
                                }}
                                {...panelAnimation}
                            >
                                {/* Improved connector indicator pointing to the trigger button */}
                                <div
                                    className="absolute w-3.5 h-3.5 bg-white dark:bg-zinc-950 border-t border-l border-gray-200 dark:border-zinc-800 shadow-sm z-50"
                                    style={arrowPosition}
                                ></div>

                                <div className="bg-bg border border-[#222] rounded-lg shadow-xl p-4 w-full text-sm relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-title-light">Developer Tools</h3>
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

                                    {actionResult && (
                                        <div className="mb-3 p-2 bg-gray-100 dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-800 rounded text-xs text-center text-gray-800 dark:text-offwhite font-medium">
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
                                                            className="
border border-button-borderrounded-md p-2 bg-gray-50 dark:bg-zinc-900/30 mb-2"
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
                                                                    <div className="font-medium text-gray-800 dark:text-zinc-200 mb-1">
                                                                        {item.key}
                                                                    </div>
                                                                    <div>
                                                                        <JSONViewer
                                                                            data={item.value}
                                                                            defaultExpanded={false}
                                                                            onEdit={() => startEditing(item.key, item.value)}
                                                                            onDelete={() => deleteStorageItem(item.key, "local")}
                                                                            isMultiple={localStorageItems.length > 3}
                                                                            onViewAll={() => handleViewAllItems("local")}
                                                                        />
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
                                                            className="
border border-button-borderrounded-md p-2 bg-gray-50 dark:bg-zinc-900/30 mb-2"
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
                                                                    <div className="font-medium text-gray-800 dark:text-zinc-200 mb-1">
                                                                        {item.key}
                                                                    </div>
                                                                    <div>
                                                                        <JSONViewer
                                                                            data={item.value}
                                                                            defaultExpanded={false}
                                                                            onEdit={() => startEditing(item.key, item.value)}
                                                                            onDelete={() => deleteStorageItem(item.key, "session")}
                                                                            isMultiple={sessionStorageItems.length > 3}
                                                                            onViewAll={() => handleViewAllItems("session")}
                                                                        />
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
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* View All Dialog */}
            <Dialog open={viewAllData !== null} onOpenChange={handleCloseViewAll}>
                <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>{viewAllData?.title}</DialogTitle>
                        <DialogDescription>
                            Complete overview of all stored items.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="overflow-auto flex-grow">
                        {viewAllData && (
                            <JSONViewer
                                data={viewAllData.data}
                                defaultExpanded={true}
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default memo(DevToolsWidget);

