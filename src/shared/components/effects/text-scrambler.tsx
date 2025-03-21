"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { scrambleText, CharacterSets } from "helpers";

type TProps = {
  href: string;
  text: string;
  isActive: boolean;
  className?: string;
};

const SCRAMBLE_OPTIONS = CharacterSets;
const SCRAMBLED_VARIANT = SCRAMBLE_OPTIONS.LETTERS;

export function TextScrambler({
  href,
  text,
  isActive,
  className = "",
}: TProps) {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isTouched, setIsTouched] = useState<boolean>(false);
  const [scrambledText, setScrambledText] = useState<string>(text);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const iterationRef = useRef<number>(0);

  // Start or stop scrambling effect based on hover/touch state
  useEffect(() => {
    if (!isHovered && !isTouched) {
      setScrambledText(text);
      return () => {};
    }

    const maxIterations = 10;
    
    const updateScrambledText = () => {
      const iteration = iterationRef.current;
      const correctChars = Math.floor((iteration / maxIterations) * text.length);
      
      setScrambledText(
        text
          .split("")
          .map((char, idx) => {
            if (char === " ") return " ";
            if (idx < correctChars) return text[idx];
            return scrambleText(1, SCRAMBLED_VARIANT);
          })
          .join("")
      );

      iterationRef.current += 1;
      
      if (iterationRef.current >= maxIterations) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setScrambledText(text);
      }
    };

    // Reset iteration counter when starting a new scramble
    iterationRef.current = 0;
    
    // Clear any existing interval before starting a new one
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(updateScrambledText, 50);
    
    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isHovered, isTouched, text]);

  // Auto-reset touch state after delay
  useEffect(() => {
    if (!isTouched) return;
    
    const timer = setTimeout(() => {
      setIsTouched(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [isTouched]);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsTouched(true)}
      style={{
        fontFamily: "monospace",
        width: `${text.length * 0.65}em`,
        textAlign: "center",
        height: "1.5em",
        display: "inline-block",
      }}
    >
      <span
        className="invisible absolute inset-0"
        aria-hidden="true"
        style={{ fontFamily: "monospace" }}
      >
        {text}
      </span>
      <Link
        href={href}
        className={`absolute inset-0 flex items-center justify-center transition-colors duration-200 ${
          isActive ? "text-white" : "text-[#8C877D] hover:text-white"
        }`}
        style={{ fontFamily: "monospace" }}
      >
        {scrambledText}
      </Link>
      <div
        className={`absolute inset-0 -z-10 rounded-full bg-[#0f0] blur-xl opacity-0 transition-opacity duration-300 ${
          isHovered || isTouched ? "opacity-5" : ""
        }`}
        aria-hidden="true"
      />
    </div>
  );
}