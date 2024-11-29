"use client";

import { Biometric } from "@/components/features/biometric";
import { MultiFactor } from "@/components/features/multi-factor";
import { Performance } from "@/components/features/performance";
import { SessionManagement } from "@/components/features/session-management";
import { ZeroDeps } from "@/components/features/zero-deps";
import { motion } from "framer-motion";
import { AlertTriangle, Fingerprint, Key, Lock, Shield, Zap } from "lucide-react";
import { BentoCard } from "./bento-grid";
import FraudPrevention from "./fraud-prevention";

const features = [
  {
    title: "Session Management",
    description: "Complete session lifecycle management with device tracking and instant revocation",
    icon: Shield,
    component: SessionManagement,
    size: "large" as const,
    gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
  },
  {
    title: "Multi-Factor Auth",
    description: "Secure authentication with support for multiple 2FA methods",
    icon: Key,
    component: MultiFactor,
    gradient: "from-purple-500/20 via-pink-500/10 to-transparent",
  },
  {
    title: "Fraud Prevention",
    description: "Advanced fraud detection and prevention system",
    icon: AlertTriangle,
    component: FraudPrevention,
    gradient: "from-red-500/20 via-orange-500/10 to-transparent",
  },
  {
    title: "Zero Dependencies",
    description: "Lightweight implementation with no external dependencies",
    icon: Lock,
    component: ZeroDeps,
    size: "large" as const,
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
  },
  {
    title: "Biometric Auth",
    description: "Native biometric authentication support",
    icon: Fingerprint,
    component: Biometric,
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
  },
  {
    title: "High Performance",
    description: "Optimized for speed and minimal overhead",
    icon: Zap,
    component: Performance,
    gradient: "from-violet-500/20 via-purple-500/10 to-transparent",
  },
];

export function FeatureGrid() {
  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: [
            "radial-gradient(600px circle at 0% 0%, rgba(124, 58, 237, 0.1), transparent 40%)",
            "radial-gradient(600px circle at 100% 100%, rgba(124, 58, 237, 0.1), transparent 40%)",
            "radial-gradient(600px circle at 50% 50%, rgba(124, 58, 237, 0.1), transparent 40%)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      {features.map((feature, i) => {
        const Icon = feature.icon;
        const Component = feature.component;

        return (
          <BentoCard
            key={feature.title}
            size={feature.size}
            gradient={feature.gradient}
          >
            <div className="h-full flex flex-col">
              <div className="mb-6 flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-primary/0 blur-xl" />
                  <div className="relative rounded-xl p-3 bg-gradient-to-br from-primary/20 to-primary/5">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                  {feature.title}
                </h3>
              </div>
              <p className="mb-6 text-muted-foreground text-sm">
                {feature.description}
              </p>
              <div className="flex-1 relative rounded-xl overflow-hidden bg-gradient-to-br from-background/50 to-background/20 p-4">
                <Component />
              </div>
            </div>
          </BentoCard>
        );
      })}
    </div>
  );
}
