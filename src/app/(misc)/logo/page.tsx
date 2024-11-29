"use client"

import { VariantCard } from "@/components/theme/logo/variant-card"
import { Button } from "@/shared/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Moon, RefreshCw, Sun } from 'lucide-react'
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const colorVariants = [
    {
        variant: "light" as const,
        customColors: {
            fill: "#ffffff",
            fillOutline: "#f8fafc",
            fillTop: "#f1f5f9",
            fillLeft: "#e2e8f0",
            fillRight: "#cbd5e1",
        },
        variantCode: `{
  containerVariants: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }
}`,
        description: "Clean light theme variant"
    },
    {
        variant: "dark" as const,
        customColors: {
            fill: "#000000",
            fillOutline: "#171717",
            fillTop: "#242424",
            fillLeft: "#171717",
            fillRight: "#000000",
        },
        variantCode: `{
  containerVariants: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }
}`,
        description: "Vercel-inspired dark theme variant"
    },
    {
        variant: "stroke" as const,
        customColors: {
            fill: "transparent",
            fillOutline: "currentColor",
            fillTop: "transparent",
            fillLeft: "transparent",
            fillRight: "transparent",
        },
        variantCode: `{
  containerVariants: baseContainerVariants,
  pathVariants: {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: { duration: 1, ease: "easeInOut" }
    }
  }
}`,
        description: "Outlined stroke animation"
    },
    {
        variant: "glassmorphic" as const,
        customColors: {
            fill: "rgba(255, 255, 255, 0.1)",
            fillOutline: "rgba(255, 255, 255, 0.2)",
            fillTop: "rgba(255, 255, 255, 0.15)",
            fillLeft: "rgba(255, 255, 255, 0.1)",
            fillRight: "rgba(255, 255, 255, 0.05)",
        },
        variantCode: `{
  containerVariants: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 }
    }
  }
}`,
        description: "Modern glassmorphic effect"
    },
    {
        variant: "neon" as const,
        customColors: {
            fill: "#00ff00",
            fillOutline: "#00ff00",
            fillTop: "#00ff99",
            fillLeft: "#00ffcc",
            fillRight: "#00ffee",
        },
        variantCode: `{
  containerVariants: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  },
  pathVariants: {
    hidden: { opacity: 0, filter: "brightness(1)" },
    visible: {
      opacity: 1,
      filter: "brightness(1.5)",
      transition: {
        repeat: Infinity,
        repeatType: "reverse",
      }
    }
  }
}`,
        description: "Glowing neon effect with pulsing brightness"
    },
    {
        variant: "rainbow" as const,
        customColors: {
            fill: "#ff0000",
            fillOutline: "#ff0000",
            fillTop: "#ff3300",
            fillLeft: "#ff6600",
            fillRight: "#ff9900",
        },
        variantCode: `{
  containerVariants: baseContainerVariants,
  className: "animate-rainbow"
}`,
        description: "Continuous color cycle animation"
    },

    {
        variant: "crystal" as const,
        customColors: {
            fill: "#ffffff",
            fillOutline: "#ffffff",
            fillTop: "#f0f0f0",
            fillLeft: "#e0e0e0",
            fillRight: "#d0d0d0",
        },
        variantCode: `{
  containerVariants: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      filter: "brightness(1.2) contrast(1.1)",
    }
  }
}`,
        description: "Crystalline appearance with light refraction"
    }
]

const animationVariants = [
    {
        variant: "stagger-triangles" as const,
        customColors: {
            fill: "#4a90e2",
            fillOutline: "#4a90e2",
            fillTop: "#5da0e2",
            fillLeft: "#70b0e2",
            fillRight: "#83c0e2",
        },
        variantCode: `{
  containerVariants: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  },
  segmentVariants: {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "backOut" }
    }
  }
}`,
        description: "Each triangle animates in sequence"
    },
    {
        variant: "rotate-segments" as const,
        customColors: {
            fill: "#4ae290",
            fillOutline: "#4ae290",
            fillTop: "#5de2a0",
            fillLeft: "#70e2b0",
            fillRight: "#83e2c0",
        },
        variantCode: `{
  containerVariants: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  },
  segmentVariants: {
    hidden: { rotate: -180, opacity: 0 },
    visible: {
      rotate: 0,
      opacity: 1,
      transition: { type: "spring", damping: 10 }
    }
  }
}`,
        description: "Segments rotate into place"
    },
    {
        variant: "wave" as const,
        customColors: {
            fill: "#904ae2",
            fillOutline: "#904ae2",
            fillTop: "#a05de2",
            fillLeft: "#b070e2",
            fillRight: "#c083e2",
        },
        variantCode: `{
  containerVariants: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  },
  segmentVariants: {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: [0, -20, 0],
      opacity: 1,
      transition: {
        y: {
          repeat: Infinity,
          repeatType: "reverse",
          duration: 2,
          ease: "easeInOut"
        }
      }
    }
  }
}`,
        description: "Continuous wave animation"
    }
]

const experimentalVariants = [
    {
        variant: "glitch" as const,
        customColors: {
            fill: "#ff00ff",
            fillOutline: "#00ffff",
            fillTop: "#ffff00",
            fillLeft: "#ff0000",
            fillRight: "#00ff00",
        },
        variantCode: `{
  containerVariants: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      x: [0, -2, 2, -2, 0],
      transition: {
        x: {
          repeat: Infinity,
          duration: 0.5,
          ease: "steps(5)",
        }
      }
    }
  }
}`,
        description: "Glitch effect with color splitting"
    },
    {
        variant: "liquid" as const,
        customColors: {
            fill: "#0088ff",
            fillOutline: "#0088ff",
            fillTop: "#00aaff",
            fillLeft: "#00ccff",
            fillRight: "#00eeff",
        },
        variantCode: `{
  containerVariants: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      scale: [1, 1.05, 0.95, 1],
      transition: {
        scale: {
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut",
        }
      }
    }
  }
}`,
        description: "Fluid morphing animation"
    },
    {
        variant: "magnetic" as const,
        customColors: {
            fill: "#ff3366",
            fillOutline: "#ff3366",
            fillTop: "#ff6699",
            fillLeft: "#ff99cc",
            fillRight: "#ffccff",
        },
        variantCode: `{
  containerVariants: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      rotate: [0, 5, -5, 0],
      transition: {
        rotate: {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }
      }
    }
  }
}`,
        description: "Magnetic attraction effect"
    }
]

export default function Demo() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()
    const [replayKey, setReplayKey] = useState(0)
    const [activeTab, setActiveTab] = useState("color")

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted p-8 transition-colors duration-300">
            <div className="mx-auto max-w-6xl space-y-12">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Shield Logo Variants</h1>
                    <div className="flex items-center gap-4">
                        <Button
                            size="lg"
                            onClick={() => setReplayKey(k => k + 1)}
                            className="gap-2"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Replay All
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                            className="relative"
                        >
                            <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="color">Color Variants</TabsTrigger>
                        <TabsTrigger value="animation">Animation Variants</TabsTrigger>
                        <TabsTrigger value="experimental">Experimental</TabsTrigger>
                    </TabsList>

                    <TabsContent value="color" className="space-y-8">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {colorVariants.map(({ variant, customColors, variantCode, description }) => (
                                <VariantCard
                                    key={`${variant}-${replayKey}`}
                                    variant={variant}
                                    customColors={customColors}
                                    variantCode={variantCode}
                                    description={description}
                                    className="bg-card transition-colors duration-300"
                                />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="animation" className="space-y-8">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {animationVariants.map(({ variant, customColors, variantCode, description }) => (
                                <VariantCard
                                    key={`${variant}-${replayKey}`}
                                    variant={variant}
                                    customColors={customColors}
                                    variantCode={variantCode}
                                    description={description}
                                    className="bg-card transition-colors duration-300"
                                />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="experimental" className="space-y-8">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {experimentalVariants.map(({ variant, customColors, variantCode, description }) => (
                                <VariantCard
                                    key={`${variant}-${replayKey}`}
                                    variant={variant}
                                    customColors={customColors}
                                    variantCode={variantCode}
                                    description={description}
                                    className="bg-card transition-colors duration-300"
                                />
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

