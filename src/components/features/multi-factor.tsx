"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

export function MultiFactor() {
  const ref = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const isInView = useInView(ref, { once: true });
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const digits = ["2", "3", "8", "1"];

  return (
    <div ref={ref} className="relative h-full flex items-center justify-center">
      <div className="w-full max-w-[240px]">
        <motion.div
          className="text-sm text-primary mb-3 font-medium"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
        >
          Enter verification code
        </motion.div>
        <div className="flex gap-2 justify-between">
          {digits.map((digit, i) => (
            <motion.div
              key={i}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              onHoverStart={() => setFocusedIndex(i)}
              onHoverEnd={() => setFocusedIndex(null)}
            >
              <motion.div
                className="absolute -inset-2 rounded-lg bg-primary/20 opacity-0"
                animate={{
                  opacity: focusedIndex === i ? 1 : 0,
                  scale: focusedIndex === i ? 1.1 : 1,
                }}
                transition={{ duration: 0.2 }}
              />
              <div className="relative w-12 h-14 rounded-lg bg-white/5 border border-primary/20 flex items-center justify-center">
                <motion.span
                  className="text-lg font-mono text-primary"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={isInView ? {
                    opacity: 1,
                    scale: 1,
                  } : {}}
                  transition={{
                    delay: 0.5 + i * 0.1,
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                >
                  {digit}
                </motion.span>
              </div>
              <motion.div
                className="absolute inset-0 rounded-lg bg-primary/20"
                initial={{ opacity: 0 }}
                animate={isInView ? {
                  opacity: [0, 0.2, 0],
                  scale: [1, 1.1, 1],
                } : {}}
                transition={{
                  duration: 1,
                  delay: 0.5 + i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              />
            </motion.div>
          ))}
        </div>
        <motion.div
          className="mt-3 text-xs text-center text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
        >
          Code expires in 4:59
        </motion.div>
      </div>
    </div>
  );
}
