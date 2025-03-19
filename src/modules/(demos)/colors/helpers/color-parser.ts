import fs from "fs"
import path from "path"
import type { ColorVariable } from "../types"

export async function parseColorVariables(): Promise<ColorVariable[]> {
    try {
        // Read the CSS file
        const filePath = path.join(process.cwd(), "src/styles/variables/colors.css")
        const cssContent = await fs.promises.readFile(filePath, "utf8")

        // Also read the tailwind config to extract the color mappings
        const twConfigPath = path.join(process.cwd(), "tailwind.config.js")
        const twConfigContent = await fs.promises.readFile(twConfigPath, "utf8")

        // Extract root variables from CSS
        const rootMatch = cssContent.match(/:root\s*{([^}]*)}/s)
        if (!rootMatch || !rootMatch[1]) {
            return []
        }

        const rootVars = rootMatch[1].trim()
        const varRegex = /--([a-zA-Z0-9-]+):\s*([^;]+);/g

        const colorVars: ColorVariable[] = []
        let match

        // Extract variable names and values
        while ((match = varRegex.exec(rootVars)) !== null) {
            const name = match[1]
            const value = match[2].trim()

            colorVars.push({
                name,
                value,
                classes: [], // Will be populated later
            })
        }

        // Find utility classes for each variable in CSS
        const classRegex = /\.([\w-]+)\s*{\s*([^:]+):\s*var\(--([a-zA-Z0-9-]+)\);?\s*}/g

        while ((match = classRegex.exec(cssContent)) !== null) {
            const className = match[1]
            const property = match[2].trim()
            const varName = match[3]

            // Find the corresponding color variable
            const colorVar = colorVars.find((v) => v.name === varName)
            if (colorVar) {
                colorVar.classes.push(`.${className}`)
            }
        }

        // Extract Tailwind color mappings
        // Try to find each color variable in the Tailwind config
        const tailwindColorRegex = /'([a-zA-Z0-9-]+)'(?:\s*):(?:\s*)'var\(--([a-zA-Z0-9-]+)\)'/g

        while ((match = tailwindColorRegex.exec(twConfigContent)) !== null) {
            const twColorName = match[1]
            const cssVarName = match[2]

            // Find the corresponding color variable
            const colorVar = colorVars.find((v) => v.name === cssVarName)
            if (colorVar) {
                // Add the Tailwind classes
                colorVar.classes.push(`bg-${twColorName}`)
                colorVar.classes.push(`text-${twColorName}`)
                colorVar.classes.push(`border-${twColorName}`)
            }
        }

        // Generate Tailwind classes based on CSS variable names
        colorVars.forEach(color => {
            // If no classes detected automatically, infer from the name
            if (color.classes.length === 0) {
                if (color.name.includes('background') || color.name === 'offblack' || color.name === 'offwhite') {
                    color.classes.push(`bg-${color.name}`)
                }
                if (color.name.includes('text') || color.name.includes('title')) {
                    color.classes.push(`text-${color.name}`)
                }
                if (color.name.includes('border') || color.name.includes('button-border')) {
                    color.classes.push(`border-${color.name}`)
                }
            }

            // Remove duplicates
            color.classes = [...new Set(color.classes)]
        })

        return colorVars
    } catch (error) {
        console.error("Error parsing color variables:", error)
        return []
    }
}

