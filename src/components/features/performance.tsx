"use client";

import { clsx } from "clsx";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function Performance() {
  const ref = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const isInView = useInView(ref, { once: true });

  const metrics = [
    { label: "Auth Time", value: "<0.1ms", color: "primary" },
    { label: "Bundle Size", value: "0kb", color: "accent" },
    { label: "Memory Usage", value: "~1MB", color: "foreground" },
  ];

  return (
    <div ref={ref} className="relative h-full flex flex-col justify-between">
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            className="relative overflow-hidden rounded-lg bg-white/5 p-4"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: index * 0.2 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r"
              style={{
                background: `linear-gradient(to right, hsl(var(--${metric.color})/0.1), transparent)`,
              }}
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.2 }}
            />
            <div className="relative flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {metric.label}
              </span>
              <motion.span
                className={clsx("font-mono", `text-${metric.color}`)}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 + index * 0.2 }}
              >
                {metric.value}
              </motion.span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-4 relative h-24"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1 }}
      >
        <div className="absolute inset-0 flex items-end justify-between gap-1">
          {[0.2, 0.4, 0.8, 0.3, 0.6, 0.5, 0.7, 0.4, 0.6].map((height, i) => (
            <motion.div
              key={i}
              className="w-full bg-gradient-to-t from-primary/20 to-primary/40 rounded-t"
              initial={{ height: "0%" }}
              animate={isInView ? { height: `${height * 100}%` } : {}}
              transition={{
                duration: 0.5,
                delay: 1.2 + i * 0.1,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
