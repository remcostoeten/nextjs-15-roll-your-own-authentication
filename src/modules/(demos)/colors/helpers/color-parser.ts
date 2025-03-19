import type { ColorVariable } from "../types"

// Mock color variables for client-side rendering
const MOCK_COLOR_VARIABLES: ColorVariable[] = [
    {
        name: "offwhite",
        value: "#f5f4f4",
        classes: [".bg-offwhite", "bg-offwhite"]
    },
    {
        name: "title-light",
        value: "#f5f4f4",
        classes: [".text-title-light", "text-title-light"]
    },
    {
        name: "offblack",
        value: "#08080b",
        classes: [".bg-offblack", ".text-offblack", "bg-offblack"]
    },
    {
        name: "bg",
        value: "#111112",
        classes: [".bg-bg", "bg-bg"]
    },
    {
        name: "background-lighter",
        value: "#19191b",
        classes: [".bg-background-lighter", "bg-background-lighter"]
    },
    {
        name: "button",
        value: "#19191b",
        classes: [".bg-button", "bg-button"]
    },
    {
        name: "text-button",
        value: "#8d877c",
        classes: [".text-button", "text-button"]
    },
    {
        name: "button-border",
        value: "#4e4b47",
        classes: ["border-button-border"]
    }
]

export async function parseColorVariables(): Promise<ColorVariable[]> {
    // In a real implementation, we'd use server components or API routes
    // to read the variables from the filesystem
    return MOCK_COLOR_VARIABLES
}

