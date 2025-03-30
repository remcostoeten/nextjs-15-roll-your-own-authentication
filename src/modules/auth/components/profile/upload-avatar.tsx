"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "ui";
import { DEFAULT_AVATAR_URL } from "@/src/core/config/constants";
import { UploadButton } from "@/src/providers/upload-thing";

type UploadAvatarProps = {
  currentAvatarUrl?: string | null;
  onUploadComplete: (url: string) => void;
  userName: string;
};

export function UploadAvatar({ currentAvatarUrl, onUploadComplete, userName }: UploadAvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl);

  return (
    <div className="relative group">
      <Avatar className="h-32 w-32 ring-2 ring-offset-2 ring-offset-white ring-gray-200 transition-all duration-200 group-hover:ring-primary">
        <AvatarImage 
          src={avatarUrl || DEFAULT_AVATAR_URL()} 
          alt={userName}
          className="object-cover"
        />
        <AvatarFallback className="text-2xl">
          {userName ? userName.slice(0, 2).toUpperCase() : "??"}
        </AvatarFallback>
      </Avatar>
      
      <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            if (res?.[0]) {
              const url = res[0].url;
              setAvatarUrl(url);
              onUploadComplete(url);
            }
          }}
          onUploadError={(error: Error) => {
            console.error("Upload error:", error);
          }}
          appearance={{
            button: "ut-ready:bg-primary ut-uploading:cursor-not-allowed rounded-full px-4 py-2 text-white hover:text-white/90",
            allowedContent: "hidden",
          }}
        />
      </div>
    </div>
  );
} 