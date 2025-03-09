"use client";

import * as React from "react";
import { motion } from "framer-motion";

type SocialAuthButtonProps = {
    icon: React.ReactNode;
    children: React.ReactNode;
    onClick: () => void;
};

export function SocialAuthButton({
    icon,
    children,
    onClick,
}: SocialAuthButtonProps) {
    return (
        <motion.button
            className="flex w-full items-center justify-center gap-2.5 rounded-md border border-solid border-neutral-800 bg-neutral-900 px-10 py-2.5 text-center text-white transition-colors hover:bg-neutral-800"
            onClick={onClick}
        >
            <span className="flex items-center gap-2.5 max-w-full">
                {icon}
                <span className="text-sm">{children}</span>
            </span>
        </motion.button>
    );
}
