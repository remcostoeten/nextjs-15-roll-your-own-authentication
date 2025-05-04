import { useState } from "react";
import { IGitHubCommit, IGitHubRepository } from "../types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { GitCommit } from "lucide-react";
import { motion } from "framer-motion";

type  TProps = {
  commit: IGitHubCommit; 
  index: number;
}

export default function CommitSquare({ commit, index }: TProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const commitDate = new Date(commit.commit.author.date);
  const formattedDate = format(commitDate, "MMM d, yyyy 'at' h:mm a 'GMT'xxx");
  
  const shortMessage = commit.commit.message.length > 60 
    ? `${commit.commit.message.substring(0, 57)}...` 
    : commit.commit.message;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.1, // staggered delay based on index
        ease: [0.34, 1.56, 0.64, 1] // smooth bezier curve
      }}
    >
      <HoverCard>
        <HoverCardTrigger asChild>
          <div 
            className={cn(
              "h-4 w-4 rounded cursor-pointer transition-colors",
              "bg-[#1E1E1E] hover:bg-[#2E2E2E]",
              isHovered ? "bg-[#2E2E2E]" : ""
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label={`Commit: ${shortMessage}`}
            data-testid={`commit-square-${index}`}
          />
        </HoverCardTrigger>
        <HoverCardContent 
          className="bg-[#0D0C0C]/95 text-white border border-white/10 max-w-md p-4 backdrop-blur-md" 
          side="top" 
          align="start"
          sideOffset={5}
        >
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <GitCommit className="h-3.5 w-3.5 text-[#4e9815] mt-0.5" />
              <div>
                <h4 className="text-md font-semibold mb-1 text-[#F2F0ED]">
                  {commit.commit.message}
                </h4>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#8C877D]">Hash:</span> 
                  <code className="text-[#4e9815] font-mono">
                    {commitDate.toISOString().substring(0, 10)}
                  </code>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-[#8C877D]">Author:</span>
                  <span className="text-[#F2F0ED]">
                    {commit.commit.author.name} {commit.author?.login ? `(${commit.author.login})` : ''}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-[#8C877D]">Date:</span>
                  <span className="text-[#F2F0ED]">{formattedDate}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <a 
                href={commit.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#4e9815] hover:underline flex items-center gap-1 transition-colors hover:text-[#6bc427]"
              >
                View on GitHub
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </motion.div>
  );
}

