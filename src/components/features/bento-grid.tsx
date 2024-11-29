"use client";

import { motion } from "framer-motion";
import { cn } from "helpers";

interface BentoCardProps {
    children: React.ReactNode;
    size?: "default" | "large";
    gradient?: string;
    className?: string;
}

export function BentoCard({
    children,
    size = "default",
    gradient,
    className,
}: BentoCardProps) {
    return (
        <motion.div
            className={cn(
                "relative rounded-xl overflow-hidden",
                size === "large" ? "md:col-span-2" : "",
                className
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-background/95 to-background/50 backdrop-blur-md" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background/5" />
            {gradient && (
                <div
                    className={cn(
                        "absolute inset-0 bg-gradient-to-br opacity-20",
                        gradient
                    )}
                />
            )}
            <div className="absolute inset-px rounded-[11px] bg-gradient-to-br from-primary/20 via-accent/20 to-transparent opacity-50" />
            <div className="relative p-6">{children}</div>
        </motion.div>
    );
}
