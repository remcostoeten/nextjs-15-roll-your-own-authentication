"use client"

import NumberFlow from '@number-flow/react';
import { useEffect, useState } from "react";

interface AnimatedCommitCountProps {
  count: number
  repoName: string
}

export default function AnimatedCommitCount({ count, repoName }: AnimatedCommitCountProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="border-t border-gray-800 py-12 transition-all duration-300 hover:bg-gray-900/30">
      <div className="flex flex-col items-center justify-center space-y-3">
        <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500">{repoName}</h3>

        <div className="flex items-baseline">
          <span className="relative text-5xl font-light tracking-tighter text-white">
            {isVisible ? (
              <NumberFlow value={count} duration={2000} delay={300} easing="easeOutExpo" separator="" decimals={0} />
            ) : (
              "0"
            )}
            <span className="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-gray-400"></span>
          </span>
          <span className="ml-3 text-xl font-medium text-gray-400">Commits</span>
        </div>

        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center">
            <span className="mr-1.5 h-1 w-1 rounded-full bg-gray-600"></span>
            <span>Last push: 2h ago</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1.5 h-1 w-1 rounded-full bg-gray-600"></span>
            <span>3 contributors</span>
          </div>
        </div>

        <div className="mt-4 w-24 border-t border-gray-800"></div>
      </div>
    </div>
  )
}
