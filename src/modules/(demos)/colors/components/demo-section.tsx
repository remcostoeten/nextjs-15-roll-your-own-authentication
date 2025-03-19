"use client"

import { motion } from "framer-motion"
import type { ColorVariable } from "@/modules/(demos)/colors/types"
import { ThemeDemoPanel } from "@/modules/(demos)/colors/components/theme-demo"

type DemoSectionProps = {
    colors: ColorVariable[]
}

export function DemoSection({ colors }: DemoSectionProps) {
    return (
        <section className="py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
            >
                <h2 className="text-3xl font-bold text-title-light mb-4">Theme in Action</h2>
                <p className="text-button max-w-2xl mx-auto">
                    Hover over any element to see the CSS variable and hex value. This demo showcases how all the colors work
                    together in a real-world component.
                </p>
            </motion.div>

            <ThemeDemoPanel colors={colors} />
        </section>
    )
}

