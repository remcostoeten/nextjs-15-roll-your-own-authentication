"use client";

import { motion, useInView } from "framer-motion";
import { AlertTriangle, MapPin, Shield } from "lucide-react";
import { useRef } from "react";

export default function FraudPrevention() {
  const ref = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const isInView = useInView(ref, { once: true });

  const metrics = [
    {
      label: "Risk Score",
      value: "High",
      icon: AlertTriangle,
      color: "text-destructive",
      details: "Multiple failed attempts",
    },
    {
      label: "Location",
      value: "Unknown VPN",
      icon: MapPin,
      color: "text-yellow-500",
      details: "IP: 192.168.1.1",
    },
    {
      label: "Security",
      value: "Blocked",
      icon: Shield,
      color: "text-primary",
      details: "Auto-protection enabled",
    },
  ];

  return (
    <div ref={ref} className="relative h-full flex flex-col gap-3">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <motion.div
            key={metric.label}
            className="relative rounded-lg bg-white/5 p-3"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              style={{ transformOrigin: "left" }}
            />
            <div className="relative flex items-center gap-3">
              <div className={`p-1.5 rounded-md bg-white/5 ${metric.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{metric.label}</span>
                  <span className={`text-sm ${metric.color}`}>{metric.value}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {metric.details}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}

      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: [
            "radial-gradient(circle at 0% 0%, rgba(239, 68, 68, 0.15), transparent 50%)",
            "radial-gradient(circle at 100% 100%, rgba(239, 68, 68, 0.15), transparent 50%)",
            "radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.15), transparent 50%)",
          ],
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />
    </div>
  );
}
