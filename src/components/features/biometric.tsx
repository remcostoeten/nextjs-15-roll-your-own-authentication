"use client";

import { motion, useInView } from "framer-motion";
import { Fingerprint } from "lucide-react";
import { useRef } from "react";

export function Biometric() {
  const ref = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="relative h-full flex items-center justify-center">
      <div className="text-center">
        <motion.div
          className="relative mx-auto w-24 h-24 mb-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20"
            animate={{
              scale: [1.2, 1.4, 1.2],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
          <motion.div
            className="relative flex items-center justify-center w-full h-full rounded-full bg-primary/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Fingerprint className="w-12 h-12 text-primary" />
          </motion.div>
        </motion.div>
        <motion.div
          className="space-y-1"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
        >
          <div className="text-sm font-medium">Touch ID Ready</div>
          <div className="text-xs text-muted-foreground">
            Tap to authenticate
          </div>
        </motion.div>
      </div>
    </div>
  );
}
