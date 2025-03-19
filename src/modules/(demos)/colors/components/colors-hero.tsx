"use client"

import { motion } from "framer-motion"

export function Hero() {
    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-6xl font-bold text-title-light mb-6"
            >
                CSS Utility Classes
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-button max-w-2xl mx-auto"
            >
                A comprehensive showcase of all color utility classes defined in your CSS variables. This page automatically
                updates when changes are made to the colors.css file.
            </motion.p>
        </div>
    )
}

