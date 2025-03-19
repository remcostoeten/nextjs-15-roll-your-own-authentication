import fs from "fs"
import path from "path"
import type { ColorVariable } from "../types"

export async function parseColorVariables(): Promise<ColorVariable[]> {
    try {
        // Read the CSS file
        const filePath = path.join(process.cwd(), "src/styles/variables/colors.css")
        const cssContent = await fs.promises.readFile(filePath, "utf8")

        // Extract root variables
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

        // Find utility classes for each variable
        const classRegex = /\.([\w-]+)\s*{\s*([^:]+):\s*var$$--([a-zA-Z0-9-]+)$$;?\s*}/g

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

        return colorVars
    } catch (error) {
        console.error("Error parsing color variables:", error)
        return []
    }
}

