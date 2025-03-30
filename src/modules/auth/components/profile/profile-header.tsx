"use client";

import { Badge } from "ui";
import { useTransition } from "react";
import type { TUser } from "@/src/server/db/schema/types";
import type { TProfileFormState } from "../../api/models/types";
import { UploadAvatar } from "./upload-avatar";
import type { TProfileSchema } from "../../api/models/schemas";

type ProfileHeaderProps = {
  user: Omit<TUser, "password">;
  onAvatarUpdate: (data: TProfileSchema) => Promise<{ success: boolean }>;
  setFormState: React.Dispatch<React.SetStateAction<TProfileFormState>>;
};

export function ProfileHeader({ user, onAvatarUpdate, setFormState }: ProfileHeaderProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
      <UploadAvatar
        currentAvatarUrl={user.avatarUrl}
        userName={user.name}
        onUploadComplete={(url) => {
          startTransition(async () => {
            try {
              const updatedProfile = {
                name: user.name,
                email: user.email,
                avatarUrl: url,
                location: user.location || null,
                website: user.website || null,
                twitter: user.twitter || null,
                github: user.github || null,
                bio: user.bio || null
              };
              const result = await onAvatarUpdate(updatedProfile);
              if (result.success) {
                setFormState({
                  error: null,
                  success: "Avatar updated successfully",
                  isLoading: false,
                });
              }
            } catch (err) {
              setFormState({
                error: {
                  code: "UPLOAD_ERROR",
                  message: err instanceof Error ? err.message : "Failed to update avatar"
                },
                success: null,
                isLoading: false,
              });
            }
          });
        }}
      />

      <div className="text-center md:text-left">
        <h3 className="text-2xl font-semibold">{user.name || "User"}</h3>
        <p className="text-gray-500 mt-1">
          {user.email || "No email provided"}
        </p>
        <Badge variant="secondary" className="mt-2 text-sm">
          {user.role || "user"}
        </Badge>
        {user.bio && (
          <p className="mt-4 text-gray-600 max-w-md">
            {user.bio}
          </p>
        )}
      </div>
    </div>
  );
} 